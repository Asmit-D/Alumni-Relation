import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from "@/components/ui/badge";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { Building2, Mail, MapPin, GraduationCap, Award, Briefcase } from "lucide-react";
import useProtectedAxios from "../hooks/useProtectedAxios.js";

export default function AlumniPage() {
  const protectedAxios = useProtectedAxios();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  async function load() {
    try {
      const response = await protectedAxios.get(`alumni/${id}/`);
      setData(response.data);
      console.log("Data loaded successfully:", response.data);
    } catch (error) {
      console.log(error);
      console.log("Error loading alumni data, setting data to null.");
      setData(null); // Set data to null if there's an error
    }
  }
  useEffect(() => {
    load();
  }, []);

  if (data === null) {
    return (
      <div className='flex items-center justify-center min-h-screen px-4'>
        <div className='backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl px-8 py-6 shadow-2xl shadow-black/50'>
          <p className='text-xl text-white/80 font-light'>Unable to connect to server</p>
        </div>
      </div>
    );
  }
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6'>
      <h1 className='text-4xl md:text-5xl font-light text-white/90 mb-8'>Alumni Details</h1>
      
      {/* Profile Card */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-black/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar and Social Links */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-4 ring-white/10">
              <AvatarImage src={`${BASE_URL+data.alumni?.dp}`} className="object-cover" alt={data.alumni?.name} />
              <AvatarFallback className="text-2xl bg-white/10 text-white/60">{data.alumni?.name}</AvatarFallback>
            </Avatar>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 font-light rounded-full transition-all duration-300"
              >
                <a href={data.alumni.twitter} target="_blank" rel="noopener noreferrer">
                  <FaXTwitter className="mr-2" />
                  Twitter
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 font-light rounded-full transition-all duration-300"
              >
                <a href={data.alumni.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="mr-2" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-light text-white/90 mb-6">{data.alumni.name}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-white/80">
                <div className="p-2 rounded-full bg-white/10">
                  <Mail className="h-5 w-5 text-white/70" />
                </div>
                <span className="text-base font-light">{data.alumni.email}</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="p-2 rounded-full bg-white/10">
                  <GraduationCap className="h-5 w-5 text-white/70" />
                </div>
                <span className="text-base font-light">Batch of {data.alumni.batch}</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="p-2 rounded-full bg-white/10">
                  <MapPin className="h-5 w-5 text-white/70" />
                </div>
                <span className="text-base font-light">{data.alumni.residence}</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="p-2 rounded-full bg-white/10">
                  <Building2 className="h-5 w-5 text-white/70" />
                </div>
                <span className="text-base font-light">{data.alumni.current_company}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Information Card */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-black/20 p-6 md:p-8 space-y-10">
        {/* Entrance Exams Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-white/10">
              <Award className="h-6 w-6 text-white/70" />
            </div>
            <div>
              <h3 className="text-2xl font-light text-white/90">Entrance Exams</h3>
              <p className="text-sm text-white/50 font-light">Standardized tests</p>
            </div>
          </div>
          <div className="space-y-4">
            {!data.entrance_exam.data ? (
              <p className="text-white/50 font-light">No entrance exam information available</p>
            ) : (
              <div className="space-y-3">
                {data.entrance_exam.data.map((exam, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <Badge variant="outline" className="backdrop-blur-md bg-white/10 border-white/20 text-white/80 font-light">
                      {exam.year}
                    </Badge>
                    <h4 className="font-light text-white/80">{exam.exam}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Education Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-white/10">
              <GraduationCap className="h-6 w-6 text-white/70" />
            </div>
            <div>
              <h3 className="text-2xl font-light text-white/90">Education</h3>
              <p className="text-sm text-white/50 font-light">Academic background and qualifications</p>
            </div>
          </div>
          <div>
            {!data.education.data ? (
              <p className="text-white/50 font-light">No education information available</p>
            ) : (
              <div className="space-y-1">
                {data.education.data.map((edu, index) => (
                  <div key={index} className="relative flex gap-6 pb-8 last:pb-0">
                    {/* Timeline */}
                    <div className="relative flex flex-col items-center">
                      <div className="h-4 w-4 rounded-full bg-white/20 border-2 border-white/40 flex-shrink-0"></div>
                      {index !== data.education.data.length - 1 && (
                        <div className="w-0.5 h-full bg-white/10 absolute top-4"></div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 flex flex-col sm:flex-row gap-4 pt-0.5">
                      <Badge variant="outline" className="w-fit h-fit backdrop-blur-md bg-white/10 border-white/20 text-white/80 font-light">
                        {edu.year}
                      </Badge>
                      <div className="flex-1">
                        <h4 className="font-medium text-white/90">{edu.course}</h4>
                        <p className="text-white/60 font-light text-sm mt-1">{edu.institute}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Work Experience Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-white/10">
              <Briefcase className="h-6 w-6 text-white/70" />
            </div>
            <div>
              <h3 className="text-2xl font-light text-white/90">Work Experience</h3>
              <p className="text-sm text-white/50 font-light">Professional journey</p>
            </div>
          </div>
          <div>
            {!data.work_profile.data ? (
              <p className="text-white/50 font-light">No work experience information available</p>
            ) : (
              <div className="space-y-1">
                {data.work_profile.data.map((work, index) => (
                  <div key={index} className="relative flex gap-6 pb-8 last:pb-0">
                    {/* Timeline */}
                    <div className="relative flex flex-col items-center">
                      <div className="h-4 w-4 rounded-full bg-white/20 border-2 border-white/40 flex-shrink-0"></div>
                      {index !== data.work_profile.data.length - 1 && (
                        <div className="w-0.5 h-full bg-white/10 absolute top-4"></div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 flex flex-col sm:flex-row gap-4 pt-0.5">
                      <Badge variant="outline" className="w-fit h-fit backdrop-blur-md bg-white/10 border-white/20 text-white/80 font-light">
                        {work.year}
                      </Badge>
                      <div className="flex-1">
                        <h4 className="font-medium text-white/90">{work.position}</h4>
                        <p className="text-white/60 font-light text-sm mt-1">{work.organization}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// export async function alumniPageLoader({params}) {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     return null; // Handle missing token
//   }
//   if (!params.id) {
//     return null; // Handle missing ID
//   }
//   try {
//     const response = await axiosInstance.get(`alumni/${params.id}/`,{
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }
