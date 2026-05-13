const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.todo.createMany({
    data: [
      { text: 'Submit UAS Report', category: 'Study', deadline: '2025-05-08', done: false },
      { text: 'Beli skincare routine', category: 'Personal', deadline: '2025-05-10', done: false },
      { text: 'Olahraga pagi 30 min', category: 'Health', deadline: '2025-05-15', done: false },
      { text: 'Meeting dengan mentor', category: 'Work', deadline: '2025-05-05', done: true },
    ]
  })
  console.log('Seeding done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())