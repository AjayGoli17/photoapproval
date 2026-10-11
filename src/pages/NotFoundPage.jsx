import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-terracotta-light text-terracotta flex items-center justify-center mb-6 shadow-sm">
        <Camera className="w-8 h-8 stroke-[1.75]" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-terracotta">
        404 — Frame Not Found
      </span>

      <h1 className="editorial-heading text-3xl sm:text-4xl font-normal text-charcoal mt-2 mb-3">
        Out of Focus
      </h1>

      <p className="text-sm text-charcoal-500 max-w-md leading-relaxed mb-8">
        The studio page or project record you were looking for doesn't exist or may have been archived.
      </p>

      <div className="flex items-center gap-3">
        <Link to="/dashboard">
          <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
