import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { interviewEngine } from '../services/interviewEngine.js';
import { reportGenerator } from '../services/reportGenerator.js';
import { InterviewModel, IInterview } from '../models/Interview.js';
import { ResumeModel } from '../models/Resume.js';
import { JobDescriptionModel } from '../models/JobDescription.js';
import { memoryStore } from '../config/store.js';
import { getDBStatus } from '../config/db.js';

export const startInterview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resumeId, jobDescriptionId, type, difficulty, durationMinutes, mode, personalityMode } = req.body;
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    let resume: any;
    let job: any;

    if (!fallbackStoreActive) {
      resume = await ResumeModel.findOne({ _id: resumeId, userId });
      if (jobDescriptionId) job = await JobDescriptionModel.findById(jobDescriptionId);
    } else {
      resume = memoryStore.resumes.get(resumeId);
      if (jobDescriptionId) job = memoryStore.jobs.get(jobDescriptionId);
    }

    if (!resume) {
      res.status(404).json({ success: false, error: 'Resume required to launch tailored interview.' });
      return;
    }

    const questionList = await interviewEngine.generateInterviewPlan(
      resume.parsedData,
      job,
      type || 'Technical Interview',
      difficulty || 'Intermediate',
      durationMinutes || 20
    );

    const initialQuestion = questionList[0];
    const initialConversation = [
      {
        id: `msg-${Date.now()}-1`,
        sender: 'interviewer' as const,
        text: `Welcome! I've reviewed your resume and background. Let's begin the ${type || 'interview'}.`,
        spokenText: `Welcome! I have reviewed your background. Let's begin the interview.`,
        timestamp: new Date(),
      },
      {
        id: `msg-${Date.now()}-2`,
        sender: 'interviewer' as const,
        text: initialQuestion.question,
        spokenText: initialQuestion.question,
        timestamp: new Date(),
        questionId: initialQuestion.id,
      },
    ];

    let interview: any;
    if (!fallbackStoreActive) {
      interview = await InterviewModel.create({
        userId,
        resumeId,
        jobDescriptionId: jobDescriptionId || null,
        type: type || 'Technical Interview',
        difficulty: difficulty || 'Intermediate',
        durationMinutes: durationMinutes || 20,
        mode: mode || 'Text',
        personalityMode: personalityMode || 'Professional',
        status: 'in_progress',
        state: 'WAITING_FOR_ANSWER',
        questionList,
        currentQuestionIndex: 0,
        conversation: initialConversation,
        antiRepetition: {
          askedQuestions: [initialQuestion.question],
          coveredTopics: [initialQuestion.topic],
          testedConcepts: initialQuestion.expectedConcepts,
        },
      });
    } else {
      const id = memoryStore.generateId();
      interview = {
        _id: id,
        id,
        userId,
        resumeId,
        jobDescriptionId: jobDescriptionId || null,
        type: type || 'Technical Interview',
        difficulty: difficulty || 'Intermediate',
        durationMinutes: durationMinutes || 20,
        mode: mode || 'Text',
        personalityMode: personalityMode || 'Professional',
        status: 'in_progress',
        state: 'WAITING_FOR_ANSWER',
        questionList,
        currentQuestionIndex: 0,
        conversation: initialConversation,
        antiRepetition: {
          askedQuestions: [initialQuestion.question],
          coveredTopics: [initialQuestion.topic],
          testedConcepts: initialQuestion.expectedConcepts,
        },
        startedAt: new Date(),
      };
      memoryStore.interviews.set(id, interview);
    }

    res.status(201).json({
      success: true,
      message: 'Interview session initiated.',
      interview,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const submitAnswer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { interviewId, candidateAnswer } = req.body;
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    let interview: any;
    if (!fallbackStoreActive) {
      interview = await InterviewModel.findOne({ _id: interviewId, userId });
    } else {
      interview = memoryStore.interviews.get(interviewId);
    }

    if (!interview || interview.status !== 'in_progress') {
      res.status(404).json({ success: false, error: 'Active interview session not found.' });
      return;
    }

    // Get candidate resume
    let resume: any;
    if (!fallbackStoreActive) {
      resume = await ResumeModel.findById(interview.resumeId);
    } else {
      resume = memoryStore.resumes.get(interview.resumeId);
    }

    const currentQuestion = interview.questionList[interview.currentQuestionIndex];

    // 1. Evaluate candidate answer
    const evaluation = await interviewEngine.evaluateAnswer(
      currentQuestion,
      candidateAnswer,
      resume?.parsedData || {},
      interview
    );

    // Record candidate response
    interview.conversation.push({
      id: `ans-${Date.now()}`,
      sender: 'candidate',
      text: candidateAnswer,
      timestamp: new Date(),
      questionId: currentQuestion.id,
      evaluation,
    });

    // 2. Decide next step: adaptive follow-up or next pipeline question
    const followUp = await interviewEngine.generateAdaptiveFollowUp(
      currentQuestion,
      evaluation,
      interview.antiRepetition
    );

    let nextQuestionItem = null;
    let isComplete = false;

    if (followUp && !interview.antiRepetition.askedQuestions.includes(followUp.question)) {
      // Insert adaptive follow-up
      interview.questionList.splice(interview.currentQuestionIndex + 1, 0, followUp);
      interview.currentQuestionIndex += 1;
      nextQuestionItem = followUp;
    } else if (interview.currentQuestionIndex + 1 < interview.questionList.length) {
      interview.currentQuestionIndex += 1;
      nextQuestionItem = interview.questionList[interview.currentQuestionIndex];
    } else {
      isComplete = true;
    }

    if (!isComplete && nextQuestionItem) {
      const spokenLine = interviewEngine.generateConversationalSpokenLine(
        nextQuestionItem.question,
        evaluation,
        interview.personalityMode || 'Professional'
      );

      // Add interviewer question to conversation with conversational spokenLine
      interview.conversation.push({
        id: `q-${Date.now()}`,
        sender: 'interviewer',
        text: nextQuestionItem.question,
        spokenText: spokenLine,
        timestamp: new Date(),
        questionId: nextQuestionItem.id,
      });

      interview.antiRepetition.askedQuestions.push(nextQuestionItem.question);
      if (!interview.antiRepetition.coveredTopics.includes(nextQuestionItem.topic)) {
        interview.antiRepetition.coveredTopics.push(nextQuestionItem.topic);
      }
      nextQuestionItem.expectedConcepts.forEach((c: string) => {
        if (!interview.antiRepetition.testedConcepts.includes(c)) {
          interview.antiRepetition.testedConcepts.push(c);
        }
      });

      interview.state = 'WAITING_FOR_ANSWER';
    } else {
      // Generate final report
      interview.status = 'completed';
      interview.state = 'REPORT_GENERATION';
      interview.completedAt = new Date();
      interview.finalReport = await reportGenerator.generateReport(interview, resume?.parsedData || {});
      interview.conversation.push({
        id: `fin-${Date.now()}`,
        sender: 'interviewer',
        text: 'That concludes all our questions for today! Thank you for walking through your experience. I have compiled your comprehensive AI performance feedback report.',
        timestamp: new Date(),
      });
    }

    if (!fallbackStoreActive) {
      await interview.save();
    } else {
      memoryStore.interviews.set(interviewId, interview);
    }

    res.json({
      success: true,
      interview,
      evaluation,
      isComplete,
      nextQuestion: nextQuestionItem,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const finishInterviewEarly = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    let interview: any;
    if (!fallbackStoreActive) {
      interview = await InterviewModel.findOne({ _id: id, userId });
    } else {
      interview = memoryStore.interviews.get(id);
    }

    if (!interview) {
      res.status(404).json({ success: false, error: 'Interview not found.' });
      return;
    }

    let resume: any;
    if (!fallbackStoreActive) {
      resume = await ResumeModel.findById(interview.resumeId);
    } else {
      resume = memoryStore.resumes.get(interview.resumeId);
    }

    interview.status = 'completed';
    interview.state = 'REPORT_GENERATION';
    interview.completedAt = new Date();
    interview.finalReport = await reportGenerator.generateReport(interview, resume?.parsedData || {});

    interview.conversation.push({
      id: `fin-early-${Date.now()}`,
      sender: 'interviewer',
      text: 'Interview wrapped up. Your evaluation report is ready.',
      timestamp: new Date(),
    });

    if (!fallbackStoreActive) {
      await interview.save();
    } else {
      memoryStore.interviews.set(id, interview);
    }

    res.json({ success: true, interview });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getInterviewById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    let interview: any;
    if (!fallbackStoreActive) {
      interview = await InterviewModel.findOne({ _id: id, userId });
    } else {
      interview = memoryStore.interviews.get(id);
    }

    if (!interview) {
      res.status(404).json({ success: false, error: 'Interview not found.' });
      return;
    }

    res.json({ success: true, interview });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const listUserInterviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    let interviews: any[] = [];
    if (!fallbackStoreActive) {
      interviews = await InterviewModel.find({ userId }).sort({ createdAt: -1 });
    } else {
      interviews = Array.from(memoryStore.interviews.values())
        .filter((i) => i.userId === userId)
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    }

    res.json({ success: true, interviews });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
