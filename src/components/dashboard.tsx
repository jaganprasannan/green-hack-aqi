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

const config = {
  aqi: {
    min: 50,
    max: 110,
  },
  co: {
    min: 0,
    max: 40,
  },
  mq135: {
    min: 400,
    max: 1500,
  },
}

interface AQICategory {
  range: [number, number]
  label: string
  description: string
  color: string
}

interface AQIHistoryItem {
  time: string
  aqi: number
}

interface PollutantDataItem {
  name: string
  value: number
  unit: string
}

const aqiCategories: AQICategory[] = [
  {
    range: [0, 50],
    label: 'Good',
    description:
      'Air quality is considered satisfactory, and air pollution poses little or no risk.',
    color: '#00e400',
  },
  {
    range: [51, 100],
    label: 'Moderate',
    description:
      'Air quality is acceptable; however, some pollutants may pose a moderate health concern.',
    color: '#ffff00',
  },
  {
    range: [101, 150],
    label: 'Unhealthy for Sensitive Groups',
    description: 'Members of sensitive groups may experience health effects.',
    color: '#ff7e00',
  },
  {
    range: [151, 200],
    label: 'Unhealthy',
    description:
      'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
    color: '#ff0000',
  },
  {
    range: [201, 300],
    label: 'Very Unhealthy',
    description:
      'Health alert: everyone may experience more serious health effects.',
    color: '#8f3f97',
  },
  {
    range: [301, 500],
    label: 'Hazardous',
    description:
      'Health warnings of emergency conditions. The entire population is likely to be affected.',
    color: '#7e0023',
  },
]

const getAQICategory = (aqi: number): AQICategory => {
  return (
    aqiCategories.find(
      (category) => aqi >= category.range[0] && aqi <= category.range[1],
    ) || aqiCategories[aqiCategories.length - 1]
  )
}

const calculateAQIForCO = (co: number): number => {
  const normalizedCO = (co - config.co.min) / (config.co.max - config.co.min)
  return config.aqi.min + normalizedCO * (config.aqi.max - config.aqi.min)
}

const generateSmoothedValue = (
  prevValue: number,
  min: number,
  max: number,
  maxChange: number,
): number => {
  const change = (Math.random() * 2 - 1) * maxChange
  return Math.max(min, Math.min(max, prevValue + change))
}

const generatePollutantDataAndAQI = (
  prevCO: number,
  prevMQ135: number,
): {
  pollutants: PollutantDataItem[]
  aqi: number
} => {
  const co = generateSmoothedValue(prevCO, config.co.min, config.co.max, 4)
  const mq135 = generateSmoothedValue(
    prevMQ135,
    config.mq135.min,
    config.mq135.max,
    20,
  )

  const aqi = calculateAQIForCO(co)

  return {
    pollutants: [
      { name: 'NH3', value: mq135, unit: 'ppm' },
      { name: 'CO', value: co, unit: 'ppm' },
    ],
    aqi,
  }
}

export default function AQIDashboard(): JSX.Element {
  const [currentAQI, setCurrentAQI] = useState<number>(135)
  const [aqiHistory, setAQIHistory] = useState<AQIHistoryItem[]>([])
  const [pollutantData, setPollutantData] = useState<PollutantDataItem[]>([
    { name: 'NH3', value: 175, unit: 'ppm' },
    { name: 'CO', value: 20, unit: 'ppm' },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      const prevCO = pollutantData.find((p) => p.name === 'CO')?.value || 20
      const prevMQ135 =
        pollutantData.find((p) => p.name === 'MQ135')?.value || 175

      const { pollutants, aqi } = generatePollutantDataAndAQI(prevCO, prevMQ135)

      setCurrentAQI(aqi)
      setPollutantData(pollutants)
      setAQIHistory((prev) =>
        [...prev, { time: new Date().toLocaleTimeString(), aqi }].slice(-10),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [pollutantData])

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
                  {currentAQI.toFixed(0)}
                </p>
                <p className='text-xl' style={{ color: aqiCategory.color }}>
                  {aqiCategory.label}
                </p>
                <p className='text-sm text-gray-400'>
                  {aqiCategory.description}
                </p>
                <div className='mt-2'>
                  {pollutantData.map((pollutant) => (
                    <p key={pollutant.name} className='text-sm text-gray-400'>
                      {pollutant.name}: {pollutant.value.toFixed(2)}{' '}
                      {pollutant.unit}
                    </p>
                  ))}
                </div>
              </div>
              {currentAQI > config.aqi.max * 0.6 ? (
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
                <YAxis
                  domain={[config.aqi.min, config.aqi.max]}
                  stroke='#9CA3AF'
                />
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
