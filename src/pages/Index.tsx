import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Code, BookOpen } from 'lucide-react';
import CodeTranslator from '@/components/CodeTranslator';
import JavaScriptBasics from '@/components/JavaScriptBasics';
import Header from '@/components/Header';
 
const Index = () => {
  const [activeTab, setActiveTab] = useState('translator');
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ZAS-برمجه",
          url: `${siteUrl}/`,
          description: "ZAS-برمجه: أداة لترجمة أكواد JavaScript من العربية إلى الإنجليزية مع كشف الأخطاء والتصحيح التلقائي",
          inLanguage: "ar",
          potentialAction: {
            "@type": "SearchAction",
            target: `${siteUrl}/?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ZAS-برمجه",
          url: `${siteUrl}/`,
          logo: `${siteUrl}/https://zashjj.blogspot.com`
        })}</script>
      </Helmet>
      <Header />
      <main role="main">
      {/* Hero Section */}
      <div id="purpose" className="relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-js-yellow/10 via-js-green/10 to-arabic-blue/10 blur-3xl" />
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-js-yellow/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-js-green/20 rounded-full blur-2xl animate-pulse delay-1000" />
        
        <div className="relative container mx-auto px-4 py-12">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <img src="/https://zashjj.blogspot.com" alt="شعار ZAS-برمجه" className="h-5 w-5 rounded-sm" loading="lazy" />
              <span className="text-sm font-medium">ZAS-برمجه</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-js-yellow via-js-green to-arabic-blue bg-clip-text text-transparent leading-tight">
              برمج بالعربية
              <br />
              نفذ بالإنجليزية
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              اكتب أكواد JavaScript بالعربية واحصل على الكود الإنجليزي النهائي مع كشف الأخطاء والتصحيح التلقائي
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-card/50 backdrop-blur-sm">
                <TabsTrigger value="translator" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  المترجم
                </TabsTrigger>
                <TabsTrigger value="basics" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  الأساسيات
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="translator" className="space-y-8">
              <CodeTranslator />
            </TabsContent>

            <TabsContent value="basics" className="space-y-8">
              <JavaScriptBasics />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Policy Section */}
      <section id="policy" className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-right space-y-3">
          <h2 className="text-2xl font-semibold">سياسة المستخدم</h2>
          <p className="text-muted-foreground">
            يهدف ZAS-برمجه إلى تسهيل كتابة أكواد JavaScript بالعربية وترجمتها للإنجليزية مع إبراز الأخطاء لتعلمٍ أسرع.
            لا نقوم بحفظ محتواك على خادم خارجي ضمن هذا الإصدار. تواصل عبر البريد للإبلاغ عن أي مشكلة.
          </p>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-2">
              <img src="/https://zashjj.blogspot.com" alt="شعار ZAS-برمجه" className="h-6 w-6 rounded-sm" loading="lazy" />
              <span className="font-semibold">ZAS-برمجه</span>
            </div>
            <p className="text-sm text-muted-foreground">
              أداة متطورة لترجمة أكواد JavaScript من العربية إلى الإنجليزية مع كشف الأخطاء
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
