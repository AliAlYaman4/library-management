import { prisma } from './prisma';
import { ActivityType } from '@prisma/client';

interface LogActivityParams {
  userId: string;
  action: ActivityType;
  entityType: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
}

export async function logActivity({
  userId,
  action,
  entityType,
  entityId,
  details,
  ipAddress,
}: LogActivityParams): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        details,
        ipAddress,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

export async function getRecentActivity(limit: number = 50) {
  return await prisma.activityLog.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

export async function getUserActivity(userId: string, limit: number = 50) {
  return await prisma.activityLog.findMany({
    where: { userId },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getActivityByType(action: ActivityType, limit: number = 50) {
  return await prisma.activityLog.findMany({
    where: { action },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}
