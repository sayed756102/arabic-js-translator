import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Code2, Lightbulb, CheckCircle } from 'lucide-react';

const JavaScriptBasics = () => {
  const basicConcepts = [
    {
      arabic: 'متغير',
      english: 'let',
      description: 'لإنشاء متغير قابل للتغيير',
      example: 'متغير اسم = "أحمد"\nlet name = "Ahmed"'
    },
    {
      arabic: 'ثابت',
      english: 'const',
      description: 'لإنشاء متغير ثابت غير قابل للتغيير',
      example: 'ثابت العمر = 25\nconst age = 25'
    },
    {
      arabic: 'دالة',
      english: 'function',
      description: 'لإنشاء دالة',
      example: 'دالة تحية() {\n  طباعة("مرحبا")\n}\nfunction greet() {\n  console.log("Hello")\n}'
    },
    {
      arabic: 'إذا',
      english: 'if',
      description: 'للشروط',
      example: 'إذا (العمر > 18) {\n  طباعة("بالغ")\n}\nif (age > 18) {\n  console.log("Adult")\n}'
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

      <Tabs defaultValue="translation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="translation" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
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
          <Card className="bg-gradient-to-r from-arabic-blue/20 to-js-yellow/20 border border-arabic-blue/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-arabic-blue">
                <CheckCircle className="h-5 w-5" />
                نظام الترجمة المحسن
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-js-yellow">المرحلة الأولى - الكلمات المحجوزة:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-js-green mt-0.5" />
                      <span>ترجمة فورية للكلمات المحجوزة في JavaScript مثل (متغير → let، دالة → function)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-js-green mt-0.5" />
                      <span>قاعدة بيانات محلية تحتوي على أكثر من 100 كلمة محجوزة</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-js-green mt-0.5" />
                      <span>تطبيع النص العربي للتعامل مع التشكيل والأشكال المختلفة للحروف</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-js-yellow">المرحلة الثانية - الكلمات الأخرى:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-js-green mt-0.5" />
                      <span>خدمة ترجمة مفتوحة المصدر (MyMemory + LibreTranslate)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-js-green mt-0.5" />
                      <span>ترخيص مفتوح يسمح بالاستخدام التجاري</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-js-green mt-0.5" />
                      <span>لا يتطلب اشتراك أو دفع مقابل مالي</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-background/50 p-4 rounded-lg border">
                <h4 className="font-semibold text-arabic-blue mb-3">مثال على آلية عمل النظام:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-js-yellow mb-2">الكود العربي:</p>
                    <div className="bg-muted p-3 rounded font-mono text-right">
متغير اسم_المستخدم = "أحمد"
دالة تحية() {"{"}
  طباعة("مرحبا " + اسم_المستخدم)
{"}"}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-js-green mb-2">الكود المترجم:</p>
                    <div className="bg-muted p-3 rounded font-mono">
let user_name = "أحمد"
function greet() {"{"}
  console.log("مرحبا " + user_name)
{"}"}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-js-yellow/10 p-4 rounded-lg border border-js-yellow/30">
                <h4 className="font-semibold text-js-yellow mb-2">لماذا هذا النظام فعال؟</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-js-green/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-6 w-6 text-js-green" />
                    </div>
                    <p className="font-medium">دقة عالية</p>
                    <p className="text-xs">ترجمة صحيحة للكلمات المحجوزة</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-arabic-blue/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Code2 className="h-6 w-6 text-arabic-blue" />
                    </div>
                    <p className="font-medium">سرعة الأداء</p>
                    <p className="text-xs">ترجمة فورية للكلمات الشائعة</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-js-yellow/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Lightbulb className="h-6 w-6 text-js-yellow" />
                    </div>
                    <p className="font-medium">مرونة التوسع</p>
                    <p className="text-xs">إضافة كلمات جديدة بسهولة</p>
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