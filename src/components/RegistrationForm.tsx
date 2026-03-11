import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  dob: z.string().min(1, { message: 'Date of Birth is required' }),
  academicCategory: z.enum(['UG', 'PG', 'Research Scholar'], {
    message: 'Please select an academic category',
  }),
  registrationType: z.enum(['Participant', 'Presenter'], {
    message: 'Please select a registration type',
  }),
  presentationType: z.enum(['Poster', 'Research Paper']).optional(),
  whatsappNumber: z.string().min(10, { message: 'Valid WhatsApp Number is required' }),
  institutionName: z.string().min(2, { message: 'Institution Name is required' }),
  accommodationRequired: z.enum(['Yes', 'No'], {
    message: 'Please select whether accommodation is required',
  }),
}).superRefine((data, ctx) => {
  if (data.registrationType === 'Presenter' && !data.presentationType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Presentation Type is required for Presenters',
      path: ['presentationType'],
    });
  }
});

type FormValues = z.infer<typeof formSchema>;

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accommodationRequired: 'No',
    },
  });

  const registrationType = watch('registrationType');

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const { error } = await supabase.from('registrations').insert([
        {
          full_name: data.fullName,
          email: data.email,
          dob: data.dob,
          academic_category: data.academicCategory,
          reg_type: data.registrationType,
          presentation_type: data.registrationType === 'Presenter' ? data.presentationType : null,
          whatsapp_number: data.whatsappNumber,
          institution: data.institutionName,
          accommodation_required: data.accommodationRequired === 'Yes',
        },
      ]);

      if (error) {
        setSubmitError(error.message || 'Failed to submit registration. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
    } catch (err: any) {
      setSubmitError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-8 form-card p-10 text-center animate-[fade-in_0.5s_ease-out]">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Pre-Registration Received
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Thank you for completing the preliminary registration form. Your details have been recorded successfully. Please monitor your email for the final registration and payment links.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="form-button max-w-sm mx-auto"
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto form-card p-6 md:p-10 mb-20 shadow-md border-t-4 border-t-university-blue">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Participant Details</h2>
        <p className="text-gray-500 text-sm">Fields marked with an asterisk (*) are required.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Full Name */}
        <div>
          <label className="form-label">Full Name <span className="text-red-500">*</span></label>
          <input
            {...register('fullName')}
            className={`form-input ${errors.fullName ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g. Rohan patil"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="form-label">Email Address <span className="text-red-500">*</span></label>
          <input
            type="email"
            {...register('email')}
            className={`form-input ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="jane.doe@university.edu"
          />
          <p className="text-gray-500 text-xs mt-1.5">This email will be used for all summit correspondence.</p>
          {errors.email && <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.email.message}</p>}
        </div>

        {/* DOB */}
        <div>
          <label className="form-label">Date of Birth <span className="text-red-500">*</span></label>
          <input
            type="date"
            {...register('dob')}
            className={`form-input ${errors.dob ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.dob && <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.dob.message}</p>}
        </div>

        {/* WhatsApp Number */}
        <div>
          <label className="form-label">WhatsApp Number <span className="text-red-500">*</span></label>
          <input
            type="tel"
            {...register('whatsappNumber')}
            className={`form-input ${errors.whatsappNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="234 567 8900"
          />
          {errors.whatsappNumber && <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.whatsappNumber.message}</p>}
        </div>

        {/* Institution Name */}
        <div>
          <label className="form-label">Institution Name <span className="text-red-500">*</span></label>
          <input
            {...register('institutionName')}
            className={`form-input ${errors.institutionName ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g. University of Science"
          />
          {errors.institutionName && <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.institutionName.message}</p>}
        </div>

        {/* Academic Category */}
        <div>
          <label className="form-label">Academic Category <span className="text-red-500">*</span></label>
          <select
            {...register('academicCategory')}
            className={`form-input appearance-none bg-white ${errors.academicCategory ? 'border-red-500 focus:ring-red-500' : ''}`}
            defaultValue=""
          >
            <option value="" disabled>Select your current academic standing</option>
            <option value="UG">Undergraduate (UG)</option>
            <option value="PG">Postgraduate (PG)</option>
            <option value="Research Scholar">Research Scholar</option>
          </select>
          {errors.academicCategory && <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.academicCategory.message}</p>}
        </div>

        {/* Registration Type (Vertical Radio Group) */}
        <div>
          <label className="form-label">Registration Type <span className="text-red-500">*</span></label>
          <div className="mt-3 space-y-3">
            <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                value="Participant"
                {...register('registrationType')}
                className="w-4 h-4 text-university-blue border-gray-300 focus:ring-university-blue"
              />
              <span className="ml-3 text-gray-700 font-medium">Standard Participant</span>
            </label>
            <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                value="Presenter"
                {...register('registrationType')}
                className="w-4 h-4 text-university-blue border-gray-300 focus:ring-university-blue"
              />
              <span className="ml-3 text-gray-700 font-medium">Research Presenter</span>
            </label>
          </div>
          {errors.registrationType && <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.registrationType.message}</p>}
        </div>

        {/* Presentation Type (Conditional) */}
        {registrationType === 'Presenter' && (
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-md animate-[fade-in_0.2s_ease-out]">
            <label className="form-label">Presentation Format <span className="text-red-500">*</span></label>
            <p className="text-gray-500 text-xs mb-3">Please select how you intend to present your research.</p>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="Poster"
                  {...register('presentationType')}
                  className="w-4 h-4 text-university-blue border-gray-300 focus:ring-university-blue"
                />
                <span className="ml-3 text-gray-700">Poster Presentation</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="Research Paper"
                  {...register('presentationType')}
                  className="w-4 h-4 text-university-blue border-gray-300 focus:ring-university-blue"
                />
                <span className="ml-3 text-gray-700">Qubithon (ideathon)</span>
              </label>
            </div>
            {errors.presentationType && <p className="text-red-500 text-sm mt-2 font-medium">{errors.presentationType.message}</p>}
          </div>
        )}

        {/* Accommodation Toggle */}
        <div className="pt-4 border-t border-gray-100">
          <label className="form-label">Accommodation Required <span className="text-red-500">*</span></label>
          <p className="text-gray-500 text-sm mb-3">Do you require on-campus housing during the summit dates?</p>
          <div className="space-y-3">
            <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                value="Yes"
                {...register('accommodationRequired')}
                className="w-4 h-4 text-university-blue border-gray-300 focus:ring-university-blue"
              />
              <span className="ml-3 text-gray-700 font-medium">Yes</span>
            </label>
            <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                value="No"
                {...register('accommodationRequired')}
                className="w-4 h-4 text-university-blue border-gray-300 focus:ring-university-blue"
              />
              <span className="ml-3 text-gray-700 font-medium">No</span>
            </label>
          </div>
          {errors.accommodationRequired && <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.accommodationRequired.message}</p>}
        </div>

        {submitError && (
          <div className="p-4 rounded-md bg-red-50 border border-red-200 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-700 text-sm">{submitError}</p>
          </div>
        )}

        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="form-button flex justify-center items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting Form...
              </>
            ) : (
              'Submit Pre-Registration'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
