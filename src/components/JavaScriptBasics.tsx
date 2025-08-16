import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Code2, Lightbulb } from 'lucide-react';

const JavaScriptBasics = () => {
  // Translation feature explanation
  const translationFeature = {
    title: 'نظام الترجمة الذكي',
    description: 'يترجم الكود تلقائياً حسب الموقع - خارج الأقواس أم داخلها',
    outsideStrings: {
      title: 'خارج الأقواس (الكود العادي)',
      description: 'جميع الكلمات العربية تُترجم تلقائياً',
      examples: [
        {
          arabic: 'متغير اسم = "أحمد"',
          english: 'let اسم = "أحمد"',
          explanation: 'كلمة "متغير" تُترجم تلقائياً لأنها خارج الأقواس'
        },
        {
          arabic: 'دالة طباعة() {\n    اطبع("مرحبا")\n}',
          english: 'function console.log() {\n    console.log("مرحبا")\n}',
          explanation: 'جميع الكلمات خارج الأقواس تُترجم تلقائياً'
        }
      ]
    },
    insideStrings: {
      title: 'داخل الأقواس (النصوص)',
      description: 'فقط الكلمات المحاطة بـ Z تُترجم',
      examples: [
        {
          arabic: 'اطبع("مرحبا بك")',
          english: 'console.log("مرحبا بك")',
          explanation: 'النص داخل الأقواس يبقى كما هو'
        },
        {
          arabic: 'اطبع("ZمرحباZ ZبكZ")',
          english: 'console.log("Hello you")',
          explanation: 'فقط الكلمات بين Z تُترجم داخل الأقواس'
        },
        {
          arabic: 'اطبع("اهلا ZبكZ يا صديق")',
          english: 'console.log("اهلا you يا صديق")',
          explanation: 'تُترجم "بك" فقط، الباقي يبقى عربي'
        }
      ]
    }
  };

  const basicConcepts = [
    {
      arabic: 'متغير',
      english: 'let',
      description: 'لإنشاء متغير قابل للتغيير',
      example: 'ZمتغيرZ اسم = "أحمد"\nlet اسم = "Ahmed"'
    },
    {
      arabic: 'ثابت',
      english: 'const',
      description: 'لإنشاء متغير ثابت غير قابل للتغيير',
      example: 'ZثابتZ العمر = 25\nconst العمر = 25'
    },
    {
      arabic: 'دالة',
      english: 'function',
      description: 'لإنشاء دالة',
      example: 'ZدالةZ تحية() {\n  ZطباعةZ("مرحبا")\n}\nfunction تحية() {\n  console.log("مرحبا")\n}'
    },
    {
      arabic: 'إذا',
      english: 'if',
      description: 'للشروط',
      example: 'ZإذاZ (العمر > 18) {\n  ZطباعةZ("بالغ")\n}\nif (العمر > 18) {\n  console.log("بالغ")\n}'
    }
  ];

  const dataTypes = [
    {
      arabic: 'سلسلة',
      english: 'String',
      description: 'نص',
      example: '"مرحبا بالعالم"'
    },
    {
      arabic: 'رقم',
      english: 'Number',
      description: 'أرقام',
      example: '42, 3.14'
    },
    {
      arabic: 'منطقي',
      english: 'Boolean',
      description: 'صحيح أو خطأ',
      example: 'صحيح، خطأ (true, false)'
    },
    {
      arabic: 'مصفوفة',
      english: 'Array',
      description: 'قائمة من العناصر',
      example: '[1, 2, 3]'
    },
    {
      arabic: 'كائن',
      english: 'Object',
      description: 'مجموعة من الخصائص',
      example: '{ اسم: "أحمد", عمر: 25 }'
    }
  ];

  const operators = [
    {
      symbol: '+',
      arabic: 'جمع',
      description: 'جمع الأرقام أو دمج النصوص'
    },
    {
      symbol: '-',
      arabic: 'طرح',
      description: 'طرح الأرقام'
    },
    {
      symbol: '*',
      arabic: 'ضرب',
      description: 'ضرب الأرقام'
    },
    {
      symbol: '/',
      arabic: 'قسمة',
      description: 'قسمة الأرقام'
    },
    {
      symbol: '===',
      arabic: 'يساوي',
      description: 'مقارنة القيم'
    },
    {
      symbol: '!==',
      arabic: 'لا يساوي',
      description: 'عدم تساوي القيم'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-js-yellow to-js-green bg-clip-text text-transparent">
          أساسيات JavaScript
        </h2>
        <p className="text-muted-foreground">تعلم المفاهيم الأساسية للبرمجة بالجافاسكريبت</p>
      </div>

      <Tabs defaultValue="keywords" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="translation" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            نظام الترجمة
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            الكلمات المفتاحية
          </TabsTrigger>
          <TabsTrigger value="types" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            أنواع البيانات
          </TabsTrigger>
          <TabsTrigger value="operators" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            العمليات الحسابية
          </TabsTrigger>
        </TabsList>

        <TabsContent value="translation" className="space-y-4">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                {translationFeature.title}
              </CardTitle>
              <p className="text-muted-foreground">{translationFeature.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Outside Strings Section */}
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                    🔗 {translationFeature.outsideStrings.title}
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                    {translationFeature.outsideStrings.description}
                  </p>
                  
                  <div className="grid gap-3">
                    {translationFeature.outsideStrings.examples.map((example, index) => (
                      <Card key={index} className="bg-white/80 dark:bg-background/80">
                        <CardContent className="pt-3">
                          <div className="space-y-2">
                            <div>
                              <h6 className="font-medium text-xs text-muted-foreground mb-1">قبل الترجمة:</h6>
                              <code className="block bg-background border p-2 rounded text-right font-mono text-xs">
                                {example.arabic}
                              </code>
                            </div>
                            <div>
                              <h6 className="font-medium text-xs text-muted-foreground mb-1">بعد الترجمة:</h6>
                              <code className="block bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-2 rounded text-right font-mono text-xs">
                                {example.english}
                              </code>
                            </div>
                            <p className="text-xs text-muted-foreground">{example.explanation}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inside Strings Section */}
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                    📝 {translationFeature.insideStrings.title}
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    {translationFeature.insideStrings.description}
                  </p>
                  
                  <div className="grid gap-3">
                    {translationFeature.insideStrings.examples.map((example, index) => (
                      <Card key={index} className="bg-white/80 dark:bg-background/80">
                        <CardContent className="pt-3">
                          <div className="space-y-2">
                            <div>
                              <h6 className="font-medium text-xs text-muted-foreground mb-1">قبل الترجمة:</h6>
                              <code className="block bg-background border p-2 rounded text-right font-mono text-xs">
                                {example.arabic}
                              </code>
                            </div>
                            <div>
                              <h6 className="font-medium text-xs text-muted-foreground mb-1">بعد الترجمة:</h6>
                              <code className="block bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-2 rounded text-right font-mono text-xs">
                                {example.english}
                              </code>
                            </div>
                            <p className="text-xs text-muted-foreground">{example.explanation}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rules Section */}
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">📋 ملخص القواعد:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-amber-700 dark:text-amber-300 mb-2">خارج الأقواس:</h5>
                    <ul className="text-amber-600 dark:text-amber-400 space-y-1">
                      <li>• جميع الكلمات العربية تُترجم تلقائياً</li>
                      <li>• لا تحتاج لأي رموز خاصة</li>
                      <li>• مثال: متغير → let</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-amber-700 dark:text-amber-300 mb-2">داخل الأقواس:</h5>
                    <ul className="text-amber-600 dark:text-amber-400 space-y-1">
                      <li>• فقط الكلمات بين Z تُترجم</li>
                      <li>• باقي النص يبقى عربي</li>
                      <li>• مثال: "ZمرحباZ" → "Hello"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {basicConcepts.map((concept, index) => (
              <Card key={index} className="border-js-yellow/20 bg-gradient-to-br from-js-yellow/5 to-transparent">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="text-arabic-blue">{concept.arabic}</span>
                    <Badge variant="outline" className="border-js-yellow text-js-yellow">
                      {concept.english}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{concept.description}</p>
                  <div className="bg-background/50 p-3 rounded-md font-mono text-sm border">
                    <pre className="whitespace-pre-wrap text-right">{concept.example}</pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataTypes.map((type, index) => (
              <Card key={index} className="border-js-green/20 bg-gradient-to-br from-js-green/5 to-transparent">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="text-arabic-blue">{type.arabic}</span>
                    <Badge variant="outline" className="border-js-green text-js-green">
                      {type.english}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                  <div className="bg-background/50 p-2 rounded-md font-mono text-sm border">
                    {type.example}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="operators" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {operators.map((operator, index) => (
              <Card key={index} className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="text-arabic-blue">{operator.arabic}</span>
                    <Badge variant="outline" className="border-primary text-primary font-mono">
                      {operator.symbol}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{operator.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-js-yellow/10 via-js-green/10 to-arabic-blue/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-center text-xl">نصائح مهمة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-js-yellow">قواعد الكتابة:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• استخدم أقواس () للدوال</li>
                <li>• استخدم أقواس {} للكتل البرمجية</li>
                <li>• لا تنس الفاصلة المنقوطة ;</li>
                <li>• استخدم علامات التنصيص للنصوص</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-js-green">أخطاء شائعة:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• عدم إغلاق الأقواس</li>
                <li>• كتابة كلمات غير معروفة</li>
                <li>• عدم مطابقة أنواع البيانات</li>
                <li>• نسيان تعريف المتغيرات</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JavaScriptBasics;