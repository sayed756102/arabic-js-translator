import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Code2, Lightbulb } from 'lucide-react';

const JavaScriptBasics = () => {
  // Special Z-wrapping feature
  const zWrappingInfo = {
    title: 'ميزة حرف Z للترجمة',
    description: 'استخدم حرف Z لتحديد الكلمات التي تريد ترجمتها فقط',
    examples: [
      {
        arabic: 'ZمتغيرZ اسم = "أحمد"',
        english: 'let اسم = "أحمد"',
        explanation: 'فقط كلمة "متغير" ستُترجم إلى "let"'
      },
      {
        arabic: 'ZدالةZ ZطباعةZ("مرحبا")',
        english: 'function console.log("مرحبا")',
        explanation: 'كلمة "دالة" تُترجم إلى "function" و "طباعة" إلى "console.log"'
      },
      {
        arabic: 'Zإذا كانZ (العمر > 18)',
        english: 'if (العمر > 18)',
        explanation: 'فقط "إذا كان" يُترجم، باقي النص يبقى كما هو'
      }
    ]
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
          <TabsTrigger value="z-feature" className="flex items-center gap-2">
            <span className="font-bold text-lg">Z</span>
            ميزة الترجمة
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

        <TabsContent value="z-feature" className="space-y-4">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded font-bold">Z</span>
                {zWrappingInfo.title}
              </CardTitle>
              <p className="text-muted-foreground">{zWrappingInfo.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">💡 كيف تعمل؟</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  احط أي كلمة عربية بين حرفين Z مثل <code className="bg-amber-100 dark:bg-amber-800 px-1 rounded">ZمتغيرZ</code> وستُترجم تلقائياً. 
                  الكلمات بدون Z لن تُترجم وستبقى كما هي.
                </p>
              </div>
              
              <div className="grid gap-4">
                <h4 className="font-semibold">أمثلة عملية:</h4>
                {zWrappingInfo.examples.map((example, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-sm text-muted-foreground mb-1">الكود العربي:</h5>
                          <code className="block bg-background border p-2 rounded text-right font-mono text-sm">
                            {example.arabic}
                          </code>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm text-muted-foreground mb-1">النتيجة بعد الترجمة:</h5>
                          <code className="block bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-2 rounded text-right font-mono text-sm">
                            {example.english}
                          </code>
                        </div>
                        <p className="text-xs text-muted-foreground">{example.explanation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📋 قواعد مهمة:</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• استخدم حرف Z (بالإنجليزية) وليس ز (بالعربية)</li>
                  <li>• يجب وضع Z قبل وبعد الكلمة بدون مسافات</li>
                  <li>• يمكن استخدام عدة كلمات Z في نفس السطر</li>
                  <li>• الكلمات بدون Z ستبقى بالعربية في النتيجة النهائية</li>
                </ul>
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