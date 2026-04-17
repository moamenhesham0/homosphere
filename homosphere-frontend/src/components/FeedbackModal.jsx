import { CheckCircle2 } from 'lucide-react';

export default function FeedbackModal({ isVisible, title, message }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      <div className="bg-surface-container-lowest rounded-[2rem] p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="font-headline text-2xl font-bold text-on-surface mb-3">{title}</h3>
        <p className="text-on-surface-variant font-body mb-8 leading-relaxed">
          {message}
        </p>
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    </div>
  );
}

