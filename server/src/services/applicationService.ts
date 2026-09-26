import { ApplicationModel, IApplication, ApplicationStatus } from '../models/Application.js';
import { memoryStore } from '../config/store.js';
import { getDBStatus } from '../config/db.js';

export interface ApplicationAnalytics {
  totalApplications: number;
  uniqueCompanies: number;
  internshipCount: number;
  fulltimeCount: number;
  interviewsReached: number;
  offersCount: number;
  funnel: {
    saved: number;
    applied: number;
    assessment: number;
    interview: number;
    offer: number;
  };
}

export class ApplicationService {
  public async createApplication(userId: string, data: Partial<IApplication>): Promise<any> {
    const { fallbackStoreActive } = getDBStatus();

    if (!fallbackStoreActive) {
      const created = await ApplicationModel.create({
        ...data,
        userId,
        appliedAt: data.appliedAt || new Date(),
        status: data.status || 'Saved',
      });
      return created.toObject();
    } else {
      const id = memoryStore.generateId();
      const newApp = {
        _id: id,
        id,
        userId,
        opportunityId: data.opportunityId || null,
        company: data.company || 'Target Company',
        role: data.role || 'Software Engineer',
        employmentType: data.employmentType || 'Full-time',
        appliedAt: data.appliedAt || new Date(),
        status: data.status || 'Saved',
        resumeVersionId: data.resumeVersionId || null,
        applicationUrl: data.applicationUrl || '',
        source: data.source || 'Direct Application',
        notes: data.notes || '',
        nextAction: data.nextAction || '',
        interviewDate: data.interviewDate,
        salary: data.salary,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.applications.set(id, newApp);
      return newApp;
    }
  }

  public async listApplications(
    userId: string,
    filters?: { status?: string; employmentType?: string; search?: string }
  ): Promise<any[]> {
    const { fallbackStoreActive } = getDBStatus();
    let apps: any[] = [];

    if (!fallbackStoreActive) {
      try {
        const query: any = { userId };
        if (filters?.status && filters.status !== 'All') {
          query.status = filters.status;
        }
        if (filters?.employmentType && filters.employmentType !== 'All') {
          query.employmentType = filters.employmentType;
        }
        if (filters?.search) {
          const regex = new RegExp(filters.search, 'i');
          query.$or = [{ company: regex }, { role: regex }, { notes: regex }];
        }
        apps = await ApplicationModel.find(query).sort({ appliedAt: -1 }).lean();
      } catch (err) {
        apps = Array.from(memoryStore.applications.values()).filter((a) => a.userId === userId);
      }
    } else {
      apps = Array.from(memoryStore.applications.values()).filter((a) => a.userId === userId);
      if (filters?.status && filters.status !== 'All') {
        apps = apps.filter((a) => a.status === filters.status);
      }
      if (filters?.employmentType && filters.employmentType !== 'All') {
        apps = apps.filter((a) => a.employmentType === filters.employmentType);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        apps = apps.filter(
          (a) =>
            a.company.toLowerCase().includes(q) ||
            a.role.toLowerCase().includes(q) ||
            (a.notes && a.notes.toLowerCase().includes(q))
        );
      }
      apps.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
    }

    return apps;
  }

  public async updateApplication(
    userId: string,
    applicationId: string,
    updates: Partial<IApplication>
  ): Promise<any> {
    const { fallbackStoreActive } = getDBStatus();

    if (!fallbackStoreActive) {
      const updated = await ApplicationModel.findOneAndUpdate(
        { _id: applicationId, userId },
        { $set: updates },
        { new: true }
      ).lean();
      return updated;
    } else {
      const existing = memoryStore.applications.get(applicationId);
      if (!existing || existing.userId !== userId) {
        return null;
      }
      const updated = { ...existing, ...updates, updatedAt: new Date() };
      memoryStore.applications.set(applicationId, updated);
      return updated;
    }
  }

  public async deleteApplication(userId: string, applicationId: string): Promise<boolean> {
    const { fallbackStoreActive } = getDBStatus();

    if (!fallbackStoreActive) {
      const result = await ApplicationModel.deleteOne({ _id: applicationId, userId });
      return result.deletedCount > 0;
    } else {
      const existing = memoryStore.applications.get(applicationId);
      if (existing && existing.userId === userId) {
        memoryStore.applications.delete(applicationId);
        return true;
      }
      return false;
    }
  }

  public async getAnalytics(userId: string): Promise<ApplicationAnalytics> {
    const all = await this.listApplications(userId);

    const totalApplications = all.length;
    const uniqueCompanies = new Set(all.map((a) => a.company.toLowerCase().trim())).size;
    const internshipCount = all.filter((a) => a.employmentType === 'Internship').length;
    const fulltimeCount = all.filter((a) => a.employmentType === 'Full-time').length;

    const interviewsReached = all.filter((a) => a.status === 'Interview' || a.status === 'Offer').length;
    const offersCount = all.filter((a) => a.status === 'Offer').length;

    const funnel = {
      saved: all.filter((a) => a.status === 'Saved' || a.status === 'Interested').length,
      applied: all.filter((a) => a.status === 'Applied').length,
      assessment: all.filter((a) => a.status === 'Assessment').length,
      interview: all.filter((a) => a.status === 'Interview').length,
      offer: offersCount,
    };

    return {
      totalApplications,
      uniqueCompanies,
      internshipCount,
      fulltimeCount,
      interviewsReached,
      offersCount,
      funnel,
    };
  }
}

export const applicationService = new ApplicationService();
