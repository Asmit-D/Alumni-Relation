import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

export default function AddAlumniDialog({ domains = [], onSubmit }) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: "",
            batch: "",
            email: "",
            dp: null,
            twitter: "",
            linkedin: "",
            residence: "",
            current_company: "",
            domains: [],
            entrance_exam: [{ exam: "", year: "" }],
            education: [{ institute: "", course: "", startYear: "", endYear: "" }],
            work_profile: [{ organization: "", position: "", startYear: "", endYear: "" }],
        },
    });

    const [open, setOpen] = useState(false);

    // Use useFieldArray for dynamic fields
    const { fields: examFields, append: appendExam, remove: removeExam } = useFieldArray({
        control,
        name: "entrance_exam",
    });

    const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
        control,
        name: "education",
    });

    const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({
        control,
        name: "work_profile",
    });

    const handleFormSubmit = (data) => {
        // Format entrance_exam and sort by year (latest first)
        const formattedEntranceExam = 
			(data.entrance_exam.length ===0) ? null :
			data.entrance_exam
            .filter(e => e.exam && e.year)
            .map(e => ({
                year: e.year,
                exam: e.exam
            }))
            .sort((a, b) => parseInt(b.year) - parseInt(a.year));

        // Format education with year range and sort by end year (latest first)
        const formattedEducation = 
			(data.education.length ===0) ? null :
			data.education
            .filter(e => e.institute && e.course && e.startYear && e.endYear)
            .map(e => ({
                year: e.endYear ? `${e.startYear} - ${e.endYear}` : `${e.startYear} - Present`,
                course: e.course,
                institute: e.institute,
                _sortYear: e.endYear === "" ? 9999 : parseInt(e.endYear) // Present gets highest priority
            }))
            .sort((a, b) => b._sortYear - a._sortYear)
            .map(({ _sortYear, ...rest }) => rest); // remove temporary field

        // Format work_profile with year range and sort by start year (latest first)
        const formattedWorkProfile = 
			(data.work_profile.length ===0) ? null :
			data.work_profile
            .filter(w => w.organization && w.startYear)
            .map(w => ({
                year: w.endYear ? `${w.startYear} - ${w.endYear}` : `${w.startYear} - Present`,
                position: w.position || "",
                organization: w.organization,
                _sortYear: w.endYear === "" ? 9999 : parseInt(w.endYear || w.startYear) // Present jobs get highest priority
            }))
            .sort((a, b) => b._sortYear - a._sortYear)
            .map(({ _sortYear, ...rest }) => rest); // remove temporary field

		delete data.entrance_exam;
		delete data.education;
		delete data.work_profile;
        // Filter out empty entries
		const formattedData = {};
		formattedData.alumni=(data);
        formattedData.education = (formattedEducation);
        formattedData.work_profile = (formattedWorkProfile);
		formattedData.entrance_exam = (formattedEntranceExam);
        onSubmit?.(formattedData);
        setOpen(false);
        reset(); // Reset form to default values
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="flex items-center gap-2 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white/90 font-light rounded-full px-6 py-2 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30"
                    onClick={() => setOpen(true)}
                >
                    <Plus size={16} /> Add New Alumni
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl backdrop-blur-xl bg-slate-900/95 border border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-light text-white/90">Add New Alumni</DialogTitle>
					<DialogDescription className="text-sm text-white/60">
                        Fill in the alumni details below. Fields marked with * are required.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-4">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-light text-white/80 flex items-center gap-2 border-b border-white/10 pb-2">
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-white/80">Name *</Label>
                                <Input
                                    {...register("name", { required: "Name is required" })}
                                    className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 focus:bg-white/10 rounded-xl transition-all duration-300"
                                />
                                {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white/80">Profile Picture</Label>
                                <Input
                                    {...register("dp")}
                                    type="file"
                                    accept="image/*"
                                    className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 file:text-white/80 file:hidden file:bg-white/10 file:rounded-lg hover:bg-white/10 rounded-xl transition-all duration-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white/80">Batch Number *</Label>
                                <Input
                                    {...register("batch", { required: "Batch is required" })}
                                    className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 focus:bg-white/10 rounded-xl transition-all duration-300"
                                />
                                {errors.batch && <p className="text-red-400 text-xs">{errors.batch.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white/80">Email *</Label>
                                <Input 
                                    {...register("email", { 
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    type="email" 
                                    className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 focus:bg-white/10 rounded-xl transition-all duration-300"
                                />
                                {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white/80">Twitter</Label>
                                <Input 
                                    {...register("twitter")}
                                    placeholder="https://twitter.com/username"
                                    className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 focus:bg-white/10 rounded-xl transition-all duration-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white/80">LinkedIn</Label>
                                <Input 
                                    {...register("linkedin")}
                                    placeholder="https://linkedin.com/in/username"
                                    className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 focus:bg-white/10 rounded-xl transition-all duration-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white/80">Residence</Label>
                                <Input 
                                    {...register("residence")}
                                    placeholder="City, Country"
                                    className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 focus:bg-white/10 rounded-xl transition-all duration-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white/80">Current Company</Label>
                                <Input 
                                    {...register("current_company")}
                                    className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 focus:bg-white/10 rounded-xl transition-all duration-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Domain Selection */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-light text-white/80 flex items-center gap-2 border-b border-white/10 pb-2">
                            Domains
                        </h3>
                        <div className="space-y-3">
                            <Label className="text-white/80">Select Domains (Click to Select)</Label>
                            <Controller
                                name="domains"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <div className="flex flex-wrap gap-2">
                                            {domains.map((domain, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => {
                                                        const currentDomains = field.value || [];
                                                        if (currentDomains.includes(domain)) {
                                                            field.onChange(currentDomains.filter(d => d !== domain));
                                                        } else {
                                                            field.onChange([...currentDomains, domain]);
                                                        }
                                                    }}
                                                    className={`px-4 py-2 rounded-full text-sm font-light transition-all duration-300 border ${
                                                        (field.value || []).includes(domain)
                                                            ? 'backdrop-blur-md bg-white/20 border-white/30 text-white shadow-lg shadow-black/30'
                                                            : 'backdrop-blur-md bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80'
                                                    }`}
                                                >
                                                    {domain}
                                                </button>
                                            ))}
                                        </div>
                                        {field.value && field.value.length > 0 && (
                                            <div className="mt-2 p-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl">
                                                <p className="text-xs text-white/60 mb-2">Selected Domains:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {field.value.map((domain, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1 backdrop-blur-md bg-white/20 border border-white/30 text-white text-xs rounded-full"
                                                        >
                                                            {domain}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    {/* Entrance Exams Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-light text-white/80 flex items-center gap-2 border-b border-white/10 pb-2">
                            Entrance Exams
                        </h3>
                        <div className="space-y-3">
                            {examFields.map((field, i) => (
                                <div
                                    key={field.id}
                                    className="flex gap-2 items-start backdrop-blur-md bg-white/5 border border-white/10 p-3 rounded-xl"
                                >
                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <Input
                                            {...register(`entrance_exam.${i}.exam`)}
                                            placeholder="Exam Name (e.g., JEE, GATE)"
                                            className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 rounded-lg"
                                        />
                                        <Input
                                            {...register(`entrance_exam.${i}.year`)}
                                            placeholder="Year (e.g., 2023)"
                                            className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 rounded-lg"
                                        />
                                    </div>
                                    {examFields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeExam(i)}
                                            className="text-white/60 hover:text-white/90 hover:bg-white/10 rounded-full p-2"
                                        >
                                            <X size={16} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 rounded-full font-light"
                                onClick={() => appendExam({ exam: "", year: "" })}
                            >
                                <Plus size={14} className="mr-2" /> Add Exam
                            </Button>
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-light text-white/80 flex items-center gap-2 border-b border-white/10 pb-2">
                            Education
                        </h3>
                        <div className="space-y-3">
                            {educationFields.map((field, i) => (
                                <div
                                    key={field.id}
                                    className="flex gap-2 items-start backdrop-blur-md bg-white/5 border border-white/10 p-3 rounded-xl"
                                >
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                                        <Input
                                            {...register(`education.${i}.institute`)}
                                            placeholder="Institute (e.g., NITK)"
                                            className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 rounded-lg col-span-2"
                                        />
                                        <Input
                                            {...register(`education.${i}.course`)}
                                            placeholder="Course (e.g., B.Tech)"
                                            className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 rounded-lg col-span-2"
                                        />
                                        <Input
                                            {...register(`education.${i}.startYear`)}
                                            placeholder="Start Year"
                                            className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 rounded-lg"
                                        />
                                        <Input
                                            {...register(`education.${i}.endYear`)}
                                            placeholder="End Year (leave empty for Present)"
                                            className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 rounded-lg"
                                        />
                                    </div>
                                    {educationFields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeEducation(i)}
                                            className="text-white/60 hover:text-white/90 hover:bg-white/10 rounded-full p-2"
                                        >
                                            <X size={16} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 rounded-full font-light"
                                onClick={() => appendEducation({ institute: "", course: "", startYear: "", endYear: "" })}
                            >
                                <Plus size={14} className="mr-2" /> Add Education
                            </Button>
                        </div>
                    </div>

                    {/* Work Profile Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-light text-white/80 flex items-center gap-2 border-b border-white/10 pb-2">
                            Work Profile
                        </h3>
                        <div className="space-y-3">
                            {workFields.map((field, i) => (
                                <div
                                    key={field.id}
                                    className="flex gap-2 items-start backdrop-blur-md bg-white/5 border border-white/10 p-3 rounded-xl"
                                >
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                                        <Input
                                            {...register(`work_profile.${i}.organization`)}
                                            placeholder="Organization"
                                            className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 rounded-lg"
                                        />
                                        <Input
                                            {...register(`work_profile.${i}.position`)}
                                            placeholder="Position"
                                            className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 rounded-lg"
                                        />
                                        <Input
                                            {...register(`work_profile.${i}.startYear`)}
                                            placeholder="Start Year"
                                            className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 rounded-lg"
                                        />
                                        <Input
                                            {...register(`work_profile.${i}.endYear`)}
                                            placeholder="End Year (leave empty for Present)"
                                            className="backdrop-blur-md bg-white/5 border border-white/10 text-white/90 placeholder:text-white/40 focus:border-white/20 rounded-lg"
                                        />
                                    </div>
                                    {workFields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeWork(i)}
                                            className="text-white/60 hover:text-white/90 hover:bg-white/10 rounded-full p-2"
                                        >
                                            <X size={16} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 rounded-full font-light"
                                onClick={() => appendWork({ organization: "", position: "", startYear: "", endYear: "" })}
                            >
                                <Plus size={14} className="mr-2" /> Add Work Experience
                            </Button>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                reset();
                            }}
                            className="backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 rounded-full font-light px-6"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            disabled={isSubmitting}
                            className="backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-full font-light px-6 shadow-lg shadow-black/20 disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : "Save Alumni"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}