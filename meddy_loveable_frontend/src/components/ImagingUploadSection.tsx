import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, ImageIcon, FileImage, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Activity } from 'lucide-react';
import { MessageCircle } from 'lucide-react';

interface ImagingUploadSectionProps {
  onAnalysisComplete: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const MAX_FILES = 5;
const MAX_TOTAL_BYTES = 100 * 1024 * 1024; // 100MB
const ACCEPTED_EXT = ['.jpg', '.jpeg', '.png', '.dcm'];

const ImagingUploadSection: React.FC<ImagingUploadSectionProps> = ({
  onAnalysisComplete,
  isLoading,
  setIsLoading,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [userQuery, setUserQuery] = useState('Please explain this report.');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const totalSize = useMemo(() => files.reduce((sum, f) => sum + f.size, 0), [files]);

  const extAllowed = (name: string) => ACCEPTED_EXT.some((e) => name.toLowerCase().endsWith(e));

  const validateAndSetFiles = (incoming: FileList | File[]) => {
    const list = Array.from(incoming);
    const invalid = list.filter((f) => !extAllowed(f.name));
    if (invalid.length) {
      toast({
        title: 'Invalid file type',
        description: 'Allowed: JPG, JPEG, PNG, DICOM (.dcm) only.',
        variant: 'destructive',
      });
      return;
    }

    const combined = [...files, ...list];
    if (combined.length > MAX_FILES) {
      toast({ title: 'Too many files', description: `Select up to ${MAX_FILES} files.`, variant: 'destructive' });
      return;
    }

    const size = combined.reduce((s, f) => s + f.size, 0);
    if (size > MAX_TOTAL_BYTES) {
      toast({ title: 'Total size too large', description: 'Maximum total size is 100MB.', variant: 'destructive' });
      return;
    }

    setFiles(combined);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFiles(e.target.files);
      // reset value so selecting the same file again triggers change
      e.currentTarget.value = '';
    }
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleAnalyze = async () => {
    if (!files.length) {
      toast({ title: 'No files selected', description: 'Please add 1–5 images.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    for (const f of files) formData.append('files', f);
    formData.append('user_input', userQuery);
    formData.append('medical_history', medicalHistory);

    try {
      const response = await fetch(`${import.meta.env.VITE_RENDER_BACKEND_URL}/imaging/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Imaging analysis failed: ${response.status}`);
      const data = await response.json();

      // backend returns { status, llm_output, thumbnails, ... }
      const result = data?.llm_output || data;
      onAnalysisComplete(result);
      toast({ title: 'Imaging Analysis Complete', description: 'Your images were analyzed successfully.' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Analysis Failed', description: 'Could not analyze images. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background font-inter">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-text-primary">Upload Your Medical Images</h1>
          <p className="text-lg text-text-secondary">
          Get instant AI-powered analysis of your medical imaging reports. Upload up to 5 files (JPG, PNG, DICOM) and receive comprehensive explanations in plain English. Maximum combined size 100MB.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Medical Images *</label>
            <div
              className={`relative upload-border rounded-xl p-8 text-center transition-all overflow-hidden ${dragActive ? 'border-medical-primary bg-medical-primary/5' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept={ACCEPTED_EXT.join(',')}
                multiple
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              <div className="z-0 relative space-y-4 pointer-events-none">
                <Upload className="w-12 h-12 text-medical-primary mx-auto" />
                <div>
                  <p className="text-lg font-medium text-text-primary">Drop your images here or click to browse</p>
                  <p className="text-sm text-text-secondary">Up to 5 files • 100MB total • JPG/PNG/DICOM</p>
                </div>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <span>{files.length} file(s) selected</span>
                  <span>{(totalSize / 1024 / 1024).toFixed(2)} MB / 100 MB</span>
                </div>
                <ul className="space-y-2">
                  {files.map((f, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-card border border-border rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <FileImage className="w-4 h-4 text-medical-primary" />
                        <span className="text-sm text-text-primary">{f.name}</span>
                        <span className="text-xs text-text-muted">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button className="text-text-muted hover:text-text-primary" onClick={() => removeFile(idx)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* User Query */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">What would you like to know? *</label>
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="w-full px-4 py-3 bg-input rounded-xl border border-input-border focus:border-input-focus focus:ring-2 focus:ring-medical-primary/20 text-text-primary placeholder-text-muted"
              placeholder="Please explain this report."
            />
            <p className="text-xs text-text-muted">You can edit this default question or ask something specific</p>
          </div>

          {/* Medical History */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Medical History (Optional)</label>
            <textarea
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-input rounded-xl border border-input-border focus:border-input-focus focus:ring-2 focus:ring-medical-primary/20 text-text-primary placeholder-text-muted resize-none"
              placeholder="Share any relevant medical history, current medications, or symptoms that might help with the analysis..."
            />
            <p className="text-xs text-text-muted">
            Additional context helps provide more personalized insights
            </p>
          </div>

          <Button onClick={handleAnalyze} disabled={files.length === 0 || isLoading} className="w-full" variant="medical" size="lg">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing Images...
              </div>
            ) : (
              'Analyze Images'
            )}
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 bg-card border-border text-center">
            <div className="w-12 h-12 bg-medical-normal/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-medical-normal" />
            </div>
            <h3 className="font-semibold mb-2">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              Your medical data is encrypted and processed securely with HIPAA compliance.
            </p>
          </Card>

          <Card className="p-6 bg-card border-border text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Instant Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Get comprehensive medical report explanations in seconds, not hours.
            </p>
          </Card>

          <Card className="p-6 bg-card border-border text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Ask Questions</h3>
            <p className="text-sm text-muted-foreground">
              Follow up with questions about your results through our AI chat assistant.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImagingUploadSection;
