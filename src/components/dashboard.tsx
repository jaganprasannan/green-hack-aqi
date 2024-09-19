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

// Helper function to get AQI category
const getAQICategory = (aqi: number): AQICategory => {
  return (
    aqiCategories.find(
      (category) => aqi >= category.range[0] && aqi <= category.range[1],
    ) || aqiCategories[aqiCategories.length - 1]
  )
}

// Function to calculate AQI for CO pollutant based on its concentration
const calculateAQIForCO = (co: number): number => {
  if (co <= 4.4) return (co / 4.4) * 50
  if (co <= 9.4) return ((co - 4.4) / (9.4 - 4.4)) * (100 - 51) + 51
  if (co <= 12.4) return ((co - 9.4) / (12.4 - 9.4)) * (150 - 101) + 101
  if (co <= 15.4) return ((co - 12.4) / (15.4 - 12.4)) * (200 - 151) + 151
  if (co <= 30.4) return ((co - 15.4) / (30.4 - 15.4)) * (300 - 201) + 201
  if (co <= 40.4) return ((co - 30.4) / (40.4 - 30.4)) * (400 - 301) + 301
  return 500
}

// Mocked functions to simulate sensor readings from MQ135 and MQ7
const generateRandomCO = (): number => Math.random() * 40 // MQ7 sensor for CO
const generateRandomNH3 = (): number => Math.random() * 50 // MQ135 sensor for NH3
const generateRandomCO2 = (): number => Math.random() * 1000 // MQ135 sensor for CO2

// Update AQI calculation to use CO level
const generatePollutantDataAndAQI = (): {
  pollutants: PollutantDataItem[]
  aqi: number
} => {
  const co = generateRandomCO()
  const nh3 = generateRandomNH3()
  const co2 = generateRandomCO2()

  const aqi = calculateAQIForCO(co) // Calculate AQI based on CO

  return {
    pollutants: [
      { name: 'CO2', value: co2, unit: 'ppm' },
      { name: 'NH3', value: nh3, unit: 'ppm' },
      { name: 'CO', value: co, unit: 'ppm' },
    ],
    aqi,
  }
}

export default function AQIDashboard(): JSX.Element {
  const [currentAQI, setCurrentAQI] = useState<number>(0)
  const [aqiHistory, setAQIHistory] = useState<AQIHistoryItem[]>([])
  const [pollutantData, setPollutantData] = useState<PollutantDataItem[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const { pollutants, aqi } = generatePollutantDataAndAQI()

      setCurrentAQI(aqi)
      setPollutantData(pollutants)
      setAQIHistory((prev) =>
        [...prev, { time: new Date().toLocaleTimeString(), aqi }].slice(-10),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const aqiCategory = getAQICategory(currentAQI)

  return (
    <div className='h-full'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
        {/* Current AQI Card */}
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
                {/* Display pollutant levels here */}
                <div className='mt-2'>
                  {pollutantData.map((pollutant) => (
                    <p key={pollutant.name} className='text-sm text-gray-400'>
                      {pollutant.name}: {pollutant.value.toFixed(2)}{' '}
                      {pollutant.unit}
                    </p>
                  ))}
                </div>
              </div>
              {currentAQI > 100 ? (
                <AlertTriangle className='w-16 h-16 text-yellow-500' />
              ) : (
                <Leaf className='w-16 h-16 text-green-500' />
              )}
            </div>
          </CardContent>
        </Card>

        {/* AQI Trend Card */}
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

        {/* Pollutant Levels Card */}
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
