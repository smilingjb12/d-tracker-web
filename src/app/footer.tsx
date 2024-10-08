import { Constants } from "@/constants";

export function Footer() {
  return (
    <div className="bg-secondary py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="text-center md:text-left mb-4 md:mb-0 space-y-2">
          <p className="text-sm text-primary">
            © 2024 {Constants.APP_NAME}. All rights reserved.
          </p>
          <p className="text-sm text-primary">
            Contact:&nbsp;
            <a
              href={`mailto:${Constants.SUPPORT_EMAIL}`}
              className="hover:text-primary"
            >
              {Constants.SUPPORT_EMAIL}
            </a>
          </p>
        </div>
        <nav className="flex gap-4">
          <a
            className="text-sm text-primary hover:text-primary"
            href="/privacy-policy"
          >
            Privacy Policy
          </a>
          <a
            className="text-sm text-primary hover:text-primary"
            href="/terms-of-service"
          >
            Terms of Service
          </a>
        </nav>
      </div>
    </div>
  );
}
