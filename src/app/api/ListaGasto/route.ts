import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const gastos = await prisma.gasto.findMany()
  return NextResponse.json({ gastos })
}

export async function POST(request: Request) {
  const body = await request.json()

  return NextResponse.json({
    message: 'KPI creado',
    data: body,
  })
}
