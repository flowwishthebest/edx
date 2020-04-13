const db = {
    posts: [
        {
            id: 1,
            name: 'Top 10 ES6 Features every Web Developer must know',
            url: 'https://webapplog.com/es6',
            text: 'This essay will give you a quick introduction to ES6. If you don’t know what is ES6, it’s a new JavaScript implementation.',
        }
    ],
    comments: [
        {
            id: 1,
            postId: 1,
            text: 'Cruel ... var { house, mouse } = No type optimization at all',
            parentId: null,
        },
        {
            id: 2,
            postId: 1,
            text: 'I think you’re undervaluing the benefit of ‘let’ and ‘const’.',
            parentId: null,
        },
        {
            id: 3,
            postId: 1,
            text: '(p1,p2)=>{ … } ,i understand this ,thank you !',
            parentId: null,
        }
    ],
}

module.exports = { db };