import React from 'react';
import { MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const Header: React.FC = () => {
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [panelType, setPanelType] = React.useState<'purpose' | 'policy' | 'support' | 'contact' | null>(null);

  const openPanel = (type: 'purpose' | 'policy' | 'support' | 'contact') => {
    setPanelType(type);
    setPanelOpen(true);
  };
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60" dir="rtl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="inline-flex items-center gap-2 font-semibold" aria-label="الصفحة الرئيسية">
          <img src="/lovable-uploads/789bfc04-c3a4-4d55-b126-b12cf5a89722.png" alt="شعار ZAS-برمجه" className="h-6 w-6 rounded-sm" loading="lazy" />
          <span>ZAS-برمجه</span>
        </a>
        <nav className="flex items-center gap-3 text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button aria-label="المزيد" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 bg-background shadow-lg">
              <DropdownMenuItem onSelect={() => openPanel('purpose')}>
                الهدف
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openPanel('policy')}>
                سياسة المستخدم
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openPanel('support')}>
                ادعمنا
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openPanel('contact')}>
                تواصل معنا
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {panelType === 'purpose' && 'الهدف'}
              {panelType === 'policy' && 'سياسة المستخدم'}
              {panelType === 'support' && 'ادعمنا'}
              {panelType === 'contact' && 'تواصل معنا'}
            </SheetTitle>
            <SheetDescription>
              {panelType === 'purpose' && (
                <>
                  برمج بالعربية، نفذ بالإنجليزية. اكتب أكواد JavaScript بالعربية واحصل على الكود الإنجليزي النهائي مع كشف الأخطاء والتصحيح.
                </>
              )}
              {panelType === 'policy' && (
                <>
                  يهدف ZAS-برمجه إلى تسهيل كتابة أكواد JavaScript بالعربية وترجمتها للإنجليزية مع إبراز الأخطاء لتعلمٍ أسرع. لا نقوم بحفظ محتواك على خادم خارجي ضمن هذا الإصدار.
                </>
              )}
              {panelType === 'support' && (
                <>
                  تحدث معنا لإرسال دعم لجعل المشروع أكبر.
                  <div className="mt-3">
                    <a href="mailto:anwersayed531@gmail.com?subject=%D8%AF%D8%B9%D9%85%20ZAS-%D8%A8%D8%B1%D9%85%D8%AC%D9%87" className="text-primary underline">
                      anwersayed531@gmail.com
                    </a>
                  </div>
                </>
              )}
              {panelType === 'contact' && (
                <div className="space-y-3 text-right">
                  <div>
                    <div className="font-medium">الدعم</div>
                    <p className="text-muted-foreground">تحدث معنا لإرسال دعم لجعل المشروع أكبر.</p>
                    <a href="mailto:anwersayed531@gmail.com?subject=%D8%AF%D8%B9%D9%85%20ZAS-%D8%A8%D8%B1%D9%85%D8%AC%D9%87" className="text-primary underline">
                      anwersayed531@gmail.com
                    </a>
                  </div>
                  <div>
                    <div className="font-medium">الإبلاغ عن خطأ</div>
                    <a
                      href="mailto:anwersayed531@gmail.com?subject=ZAS-%D8%A8%D8%B1%D9%85%D8%AC%D9%87%20-%20%D8%AA%D8%A8%D9%84%D9%8A%D8%BA%20%D8%B9%D9%86%20%D8%AE%D8%B7%D8%A3&body=%D9%88%D8%B5%D9%81%20%D8%A7%D9%84%D8%AE%D8%B7%D8%A3%3A%0A%D9%82%D8%B7%D8%B9%D8%A9%20%D8%A7%D9%84%D9%83%D9%88%D8%AF%3A%0A"
                      className="text-primary underline"
                    >
                      أبلغ عن خطأ عبر البريد
                    </a>
                  </div>
                  <div>
                    <div className="font-medium">البريد الإلكتروني</div>
                    <a href="mailto:anwersayed531@gmail.com" className="text-primary underline">
                      anwersayed531@gmail.com
                    </a>
                  </div>
                </div>
              )}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

    </header>
  );
};

export default Header;
