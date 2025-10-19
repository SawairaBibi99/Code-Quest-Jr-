import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const teacher = await prisma.user.create({ data: { role: 'TEACHER', displayName: 'Ms. Berry' } });
  const classroom = await prisma.classroom.create({ data: { name: 'Blueberries', teacherId: teacher.id } });
  const alice = await prisma.user.create({ data: { role: 'STUDENT', displayName: 'Alice' } });
  await prisma.enrollment.create({ data: { classroomId: classroom.id, userId: alice.id } });
  await prisma.quest.create({ data: {
    title: 'Robot Maze',
    objective: 'Use loops to reach the star',
    targetSkills: ['loops','sequences'],
    levels: { create: [{ configJSON: {}, testsJSON: {}, difficulty: 1 }] }
  }});
}
main().finally(() => prisma.$disconnect());
