import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from "@/components/ui/badge"
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { Building2, Mail, MapPin, GraduationCap, Award, Briefcase } from "lucide-react"

export default function AlumniPage() {
  const data = useLoaderData();

  return (
    <div className='dark min-h-screen pb-6 bg-gray-900'>
      <div className='text-5xl font-semibold text-zinc-100 px-16 pt-10 '>Alumni Details</div>
      <Card className="mx-20 mt-8  bg-black">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={`http://127.0.0.1:8000/${data.alumni.dp}`} className="object-cover" alt={data.alumni.name} />
                <AvatarFallback className="text-2xl">{data.alumni.name}</AvatarFallback>
              </Avatar>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={data.alumni.twitter} target="_blank" rel="noopener noreferrer">
                    <FaXTwitter />
                    Twitter
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={data.alumni.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                    LinkedIn
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold">{data.alumni.name}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex text-lg items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>{data.alumni.email}</span>
                </div>
                <div className="flex text-lg items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <span>Batch of {data.alumni.batch}</span>
                </div>
                <div className="flex text-lg items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{data.alumni.residence}</span>
                </div>
                <div  className="flex text-lg items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <span>{data.alumni.current_company}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mx-20 mt-8 bg-black">
        <CardHeader>
            <CardTitle className="flex items-center text-2xl gap-2">
              <Award className="h-5 w-5" />
              Entrance Exams
            </CardTitle>
            <CardDescription>Standardized tests</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-6 pb-8">
              {!data.entrance_exam.data ? <p className="text-muted-foreground">No entrance exam information available</p> : <div>
                {data.entrance_exam.data.map((exam, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <Badge variant="outline" className="bg-gray-800 w-fit">
                    {exam.year}
                  </Badge>
                  <div>
                    <h4 className="font-semibold">{exam.exam}</h4>
                  </div>
                </div>
              ))}</div>
              }
            </div>
        </CardContent>

        <CardHeader>
            <CardTitle className="flex items-center text-2xl gap-2">
              <GraduationCap className="h-5 w-5" />
              Education
            </CardTitle>
            <CardDescription>Academic background and qualifications</CardDescription>
        </CardHeader>
        <CardContent>
            <div>
              {!data.education.data ? 
              (<p className="text-muted-foreground">No education information available</p>) : 
              (<div>
              {data.education.data.map((edu, index) => (
                <div key={index} className="relative pl-6 pb-8 border-l last:border-l-0 border-muted">
                  <div className="absolute top-0 -left-1.5 h-3 w-3 rounded-full bg-primary"></div>
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                    <div className="min-w-[150px] top-0">
                      <Badge variant="outline" className="w-fit bg-gray-800">
                        {edu.year}
                      </Badge>
                    </div>
                    <div className='top-0'>
                      <h4 className="font-semibold">{edu.course}</h4>
                      <p className="text-muted-foreground">{edu.institute}</p>
                    </div>
                  </div>
                </div>
              ))}
              </div>)
              }
            </div>
        </CardContent>

        <CardHeader>
            <CardTitle className="flex items-center text-2xl gap-2">
              <Briefcase className="h-5 w-5" />
              Work Experience
            </CardTitle>
            <CardDescription>Professional journey</CardDescription>
        </CardHeader>
        <CardContent>
            <div>
              {!data.work_profile.data ? 
              (<p className="text-muted-foreground">No work experience information available</p>) :
              (<div>
                {data.work_profile.data.map((work, index) => (
                <div key={index} className="relative pl-6 pb-8 border-l last:border-l-0 border-muted">
                  <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-primary"></div>
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                    <div className="min-w-[150px]">
                      <Badge variant="outline" className="w-fit bg-gray-800">
                        {work.year}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold">{work.position}</h4>
                      <p className="text-muted-foreground">{work.organization}</p>
                    </div>
                  </div>
                </div>
              ))}
              </div>)
              }
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
