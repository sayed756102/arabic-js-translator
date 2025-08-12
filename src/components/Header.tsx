import React from 'react';
import { Code } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60" dir="rtl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="inline-flex items-center gap-2 font-semibold">
          <Code className="h-5 w-5 text-primary" />
          <span>ZAS-برمجه</span>
        </a>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#purpose" className="text-muted-foreground hover:text-foreground transition-colors">الهدف</a>
          <a href="#policy" className="text-muted-foreground hover:text-foreground transition-colors">سياسة المستخدم</a>
          <a
            href="mailto:anwersayed531@gmail.com?subject=ZAS-%D8%A8%D8%B1%D9%85%D8%AC%D9%87%20-%20%D8%AA%D8%A8%D9%84%D9%8A%D8%BA%20%D8%B9%D9%86%20%D8%AE%D8%B7%D8%A3&body=%D9%88%D8%B5%D9%81%20%D8%A7%D9%84%D8%AE%D8%B7%D8%A3%3A%0A%D9%82%D8%B7%D8%B9%D8%A9%20%D8%A7%D9%84%D9%83%D9%88%D8%AF%3A%0A"
            className="text-primary hover:underline"
          >
            أبلغ عن خطأ
          </a>
          <a href="mailto:anwersayed531@gmail.com" className="text-primary/80 hover:text-primary">
            anwersayed531@gmail.com
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
