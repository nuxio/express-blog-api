module.exports = {
    "env": {
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "script"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "semi": [
            "error",
            "always"
        ],
        // 箭头函数大括号 
        "arrow-body-style": [
            "error",
            // 可省略 不强制使用 
            "as-needed", 
            {
                // 不需要显式返回对象字面量
                requireReturnForObjectLiteral: false,
            }
        ],
        // 箭头函数参数括号
        "arrow-parens": [
            "error", 
            "as-needed" 
            // {
            //     requireForBlockBody: true,
            // }
        ],
        // 箭头函数箭头前后是否有空格
        "arrow-spacing": [
            "error",
            {
                before: true,
                after: true
            }
        ],
        // generator 函数中 * 号周围的空格
        "generator-star-spacing": [
            "error",
            {
                before: false,
                after: true
            }
        ],
        // 强制在 yield 表达式中 * 后面使用空格
        "yield-star-spacing": [
            "error",
            "after"
        ],
        // rest 参数与扩展运算符之间的空格
        "rest-spread-spacing": [
            "error",
            "never"
        ],
        // 禁止模板字面量的花括号中出现括号 'xxx${y}ss'
        "template-curly-spacing": "error",

        // 不能修改类声明的变量
        // 如以class Name{}形object-shorthand式出现，那么Name不能做任何更改和赋值
        "no-class-assign": "error",
        // 禁止修改const 声明的变量
        "no-const-assign": "error",
        // 不允许类成员里有重复的名称
        "no-dupe-class-members": "error",
        // 不允许重复引入一个模块
        "no-duplicate-imports": "error",
        // 禁止在import，export，解构赋值中重命名和原有名字相同
        "no-useless-renam": [
            "error",
             {
                ignoreDestructuring: false,
                ignoreImport: false,
                ignoreExport: false,
            }
        ],

        // Symbol 类型不能用new关键字，应该以函数方式调用 var foo = Symbol('foo');
        "no-new-symbol": "error",
        // Symbol定义的时候增加描述语言，便于debug , var foo = Symbol('this is discription');
        "symbol-description": "error",
        // generator函数里面一定要有yield
        "require-yield": "error",
        // 使用 let 或 const 而不是 var
        "no-var": "error",
        // 禁止在字面量声明无用的计算属性 
        "no-useless-computed-key": "error",
        // 如果变量不再被赋值，应该用const声明
        "prefer-const": [
            "error",
            {
                // 解构赋值时所有变量的类型都需要保持一致
                destructuring: 'any',
                // const 需要在声明的时候赋值
                ignoreReadBeforeAssign: true
            }
        ],


        // 避免箭头函数和比较表达式混淆
        "no-confusing-arrow": [
            "error",
            {
                // 允许使用圆括号 var x = a => (1 ? 2 : 3);
                allowParens: true
            }
        ],
        // 使用模板字面量而不是字符串拼接
        "prefer-template": "error",
        // 使用扩展运算符(...)而非.apply()调用可变参数
        "prefer-spread": "error",
        // 用rest参数 (...args)  替换 arguments ,
        // 因为rest运算符可以提供一个真正的数组,能显式表示参数
        // 而arguments是一个对象，操作中要通过call等手段调用数组方法
        "prefer-rest-params": "error",
        // 不允许使用parseInt()转化2，8，16进制
        "prefer-numeric-literals": "error",
        // 要求使用箭头函数进行回调
        "prefer-arrow-callback": [
            "error",
            {
                // 回调函数不要命名
                allowNamedFunctions: false,
                // 不使用bind绑定this
                allowUnboundThis: true
            }
        ],
        // 对象字面量语法简写
        "object-shorthand": [
            "error",
            "always",
            {
                ignoreConstructors: false,
                avoidQuotes: true
            }
        ],

        // 继承类构造函数必须调用super
        "constructor-super": "error",
        // 禁止不必要的构造函数，也就是说构造函数里面如果没有逻辑就不要写构造函数了
        "no-useless-constructor": "error",
        // 禁止在调用super之前使用this
        "no-this-before-super": "error"
    }
};