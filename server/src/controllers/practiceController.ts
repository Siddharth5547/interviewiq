import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { practiceEngine } from '../services/practiceEngine.js';
import { PracticeSessionModel } from '../models/PracticeSession.js';
import { InterviewModel } from '../models/Interview.js';
import { memoryStore } from '../config/store.js';
import { getDBStatus } from '../config/db.js';

export const getDetectedWeakAreas = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    let interviews: any[] = [];
    if (!fallbackStoreActive) {
      interviews = await InterviewModel.find({ userId, status: 'completed' });
    } else {
      interviews = Array.from(memoryStore.interviews.values()).filter(
        (i) => i.userId === userId && i.status === 'completed'
      );
    }

    const weakMap: Record<string, { topic: string; frequency: number; lowestScore: number }> = {};

    interviews.forEach((iv) => {
      if (iv.finalReport?.weakTopics) {
        iv.finalReport.weakTopics.forEach((topic: string) => {
          if (!weakMap[topic]) {
            weakMap[topic] = { topic, frequency: 1, lowestScore: 60 };
          } else {
            weakMap[topic].frequency += 1;
          }
        });
      }

      // Check conversation evaluations
      (iv.conversation || []).forEach((c: any) => {
        if (c.evaluation && c.evaluation.score < 70 && c.evaluation.testedConceptsMissed) {
          c.evaluation.testedConceptsMissed.forEach((concept: string) => {
            if (!weakMap[concept]) {
              weakMap[concept] = { topic: concept, frequency: 1, lowestScore: c.evaluation.score };
            } else {
              weakMap[concept].frequency += 1;
              weakMap[concept].lowestScore = Math.min(weakMap[concept].lowestScore, c.evaluation.score);
            }
          });
        }
      });
    });

    const weakAreas = Object.values(weakMap).sort((a, b) => b.frequency - a.frequency);

    // Provide helpful defaults if user hasn't completed an interview yet
    if (weakAreas.length === 0) {
      weakAreas.push(
        { topic: 'MongoDB Indexing & Aggregations', frequency: 2, lowestScore: 55 },
        { topic: 'JWT Token Refresh & Storage Security', frequency: 2, lowestScore: 60 },
        { topic: 'React Render Optimization & Reconciliation', frequency: 1, lowestScore: 62 },
        { topic: 'System Design: Distributed Caching with Redis', frequency: 1, lowestScore: 65 }
      );
    }

    res.json({ success: true, weakAreas });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const startPracticeSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { topic, targetSkill } = req.body;
    const userId = req.user?.userId || 'guest-user-session';

    if (!topic) {
      res.status(400).json({ success: false, error: 'Topic is required to launch practice drill.' });
      return;
    }

    const questions = await practiceEngine.generateDrill(topic, targetSkill || topic);
    const { fallbackStoreActive } = getDBStatus();

    let session: any;
    if (!fallbackStoreActive) {
      session = await PracticeSessionModel.create({
        userId,
        topic,
        targetSkill: targetSkill || topic,
        questions,
        answers: [],
        overallScore: 0,
        status: 'active',
      });
    } else {
      const id = memoryStore.generateId();
      session = {
        _id: id,
        id,
        userId,
        topic,
        targetSkill: targetSkill || topic,
        questions,
        answers: [],
        overallScore: 0,
        status: 'active',
        createdAt: new Date(),
      };
      memoryStore.practiceSessions.set(id, session);
    }

    res.status(201).json({
      success: true,
      message: 'Practice drill started.',
      session,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const submitPracticeAnswer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId, questionId, candidateAnswer } = req.body;
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    let session: any;
    if (!fallbackStoreActive) {
      session = await PracticeSessionModel.findOne({ _id: sessionId, userId });
    } else {
      session = memoryStore.practiceSessions.get(sessionId);
    }

    if (!session) {
      res.status(404).json({ success: false, error: 'Practice session not found.' });
      return;
    }

    const questionItem = session.questions.find((q: any) => q.id === questionId);
    if (!questionItem) {
      res.status(404).json({ success: false, error: 'Question not found in this drill session.' });
      return;
    }

    const evaluation = await practiceEngine.evaluatePracticeAnswer(
      questionItem.question,
      questionItem.expectedConcepts,
      candidateAnswer
    );

    session.answers.push({
      questionId,
      question: questionItem.question,
      candidateAnswer,
      score: evaluation.score,
      feedback: evaluation.feedback,
      whatWasGood: evaluation.whatWasGood,
      whatWasMissing: evaluation.whatWasMissing,
      strongerExample: evaluation.strongerExample,
    });

    // Check if all answered
    if (session.answers.length >= session.questions.length) {
      session.status = 'completed';
      session.completedAt = new Date();
      const avg = Math.round(
        session.answers.reduce((acc: number, curr: any) => acc + curr.score, 0) / session.answers.length
      );
      session.overallScore = avg;
      session.improvementNotes = [
        `Gained +${Math.round((avg - 50) * 0.4)}% clarity on "${session.topic}".`,
        'Demonstrated strong progress on technical terminology.',
      ];
    }

    if (!fallbackStoreActive) {
      await session.save();
    } else {
      memoryStore.practiceSessions.set(sessionId, session);
    }

    res.json({
      success: true,
      evaluation,
      session,
      isComplete: session.status === 'completed',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
