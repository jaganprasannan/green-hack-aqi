'use client'

import React, { useEffect, useState } from 'react'

import { AlertTriangle, Leaf } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AQICategory {
  range: [number, number]
  label: string
  color: string
}

interface AQIHistoryItem {
  time: string
  aqi: number
}

interface PollutantDataItem {
  name: string
  value: number
}

const aqiCategories: AQICategory[] = [
  { range: [0, 50], label: 'Good', color: '#00e400' },
  { range: [51, 100], label: 'Moderate', color: '#ffff00' },
  {
    range: [101, 150],
    label: 'Unhealthy for Sensitive Groups',
    color: '#ff7e00',
  },
  { range: [151, 200], label: 'Unhealthy', color: '#ff0000' },
  { range: [201, 300], label: 'Very Unhealthy', color: '#8f3f97' },
  { range: [301, 500], label: 'Hazardous', color: '#7e0023' },
]

const getAQICategory = (aqi: number): AQICategory => {
  return (
    aqiCategories.find(
      (category) => aqi >= category.range[0] && aqi <= category.range[1],
    ) || aqiCategories[aqiCategories.length - 1]
  )
}

const generateRandomAQI = (): number => Math.floor(Math.random() * 300) + 1

const generateRandomPollutantData = (): PollutantDataItem[] => [
  { name: 'PM2.5', value: Math.random() * 100 },
  { name: 'PM10', value: Math.random() * 150 },
  { name: 'O3', value: Math.random() * 100 },
  { name: 'NO2', value: Math.random() * 100 },
  { name: 'SO2', value: Math.random() * 100 },
  { name: 'CO', value: Math.random() * 10 },
]

export default function AQIDashboard(): JSX.Element {
  const [currentAQI, setCurrentAQI] = useState<number>(generateRandomAQI())
  const [aqiHistory, setAQIHistory] = useState<AQIHistoryItem[]>([
    { time: new Date().toLocaleTimeString(), aqi: currentAQI },
  ])
  const [pollutantData, setPollutantData] = useState<PollutantDataItem[]>(
    generateRandomPollutantData(),
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const newAQI = generateRandomAQI()
      setCurrentAQI(newAQI)
      setAQIHistory((prev) =>
        [...prev, { time: new Date().toLocaleTimeString(), aqi: newAQI }].slice(
          -10,
        ),
      )
      setPollutantData(generateRandomPollutantData())
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const aqiCategory = getAQICategory(currentAQI)

  return (
    <div className='h-full'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
        <Card className='bg-transparent border shadow-lg backdrop-blur-sm'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-xl font-semibold text-white'>
              Current AQI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div>
                <p
                  className='text-5xl font-bold mb-1'
                  style={{ color: aqiCategory.color }}>
                  {currentAQI}
                </p>
                <p className='text-xl' style={{ color: aqiCategory.color }}>
                  {aqiCategory.label}
                </p>
              </div>
              {currentAQI > 100 ? (
                <AlertTriangle className='w-16 h-16 text-yellow-500' />
              ) : (
                <Leaf className='w-16 h-16 text-green-500' />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='bg-transparent border shadow-lg backdrop-blur-sm'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-xl font-semibold text-white'>
              AQI Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={200}>
              <LineChart data={aqiHistory}>
                <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
                <XAxis dataKey='time' stroke='#9CA3AF' />
                <YAxis stroke='#9CA3AF' />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    backdropFilter: 'blur(4px)',
                    border: 'none',
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='aqi'
                  stroke='#8B5CF6'
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className='md:col-span-2 bg-transparent border shadow-lg backdrop-blur-sm'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-xl font-semibold text-white'>
              Pollutant Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={pollutantData}>
                <CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
                <XAxis dataKey='name' stroke='#9CA3AF' />
                <YAxis stroke='#9CA3AF' />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    backdropFilter: 'blur(4px)',
                    border: 'none',
                  }}
                />
                <Bar dataKey='value' fill='#10B981' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
