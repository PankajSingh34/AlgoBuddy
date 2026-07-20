"use client";
import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const fallbackMessage = "Something went wrong while rendering this section.";
      const errorMessage = this.state.error?.message || fallbackMessage;

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 bg-white px-4 dark:bg-[var(--udemy-dark-bg)] rounded-xl border border-gray-200 dark:border-gray-700 m-4 p-8">
          <div className="rounded-full bg-[var(--color-danger)]/10 p-3">
            <AlertTriangle className="h-6 w-6 text-[var(--color-danger)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
            Something went wrong
          </h3>
          <p className="max-w-md text-center text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
            {errorMessage}
          </p>
          <button
            onClick={this.handleReset}
            className="btn-base bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}