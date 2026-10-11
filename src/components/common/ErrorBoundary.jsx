import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('StudioFlow caught an unhandled rendering error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/dashboard';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-light text-amber flex items-center justify-center mb-6 shadow-sm border border-amber/20">
            <AlertTriangle className="w-8 h-8 stroke-[1.75]" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-amber">
            Studio Application Recovery
          </span>

          <h2 className="editorial-heading text-2xl sm:text-3xl font-normal text-charcoal mt-2 mb-3 font-serif">
            Something went out of focus
          </h2>

          <p className="text-sm text-charcoal-500 max-w-md leading-relaxed mb-6">
            A temporary view error occurred while rendering this studio workspace. Your local demo data in localStorage is intact.
          </p>

          {this.state.error?.message && (
            <div className="max-w-lg w-full p-3 mb-6 bg-ivory-100 rounded-lg border border-border text-left font-mono text-xs text-charcoal-600 overflow-x-auto">
              {this.state.error.message}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={this.handleReload}
            >
              Reload View
            </Button>
            <Button
              variant="primary"
              leftIcon={<Home className="w-4 h-4" />}
              onClick={this.handleReset}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
