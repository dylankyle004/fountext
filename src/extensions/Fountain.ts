import { Extension, markInputRule, markPasteRule, Node } from '@tiptap/core'
import { Italic, starInputRegex } from '@tiptap/extension-italic'
import Paragraph from '@tiptap/extension-paragraph'
import Underline from '@tiptap/extension-underline'

//!
export const Action = Paragraph.extend({
    name: 'action'

})

//><
export const CenteredText = Node.create({
    name: 'centeredText'

})

//@
export const Character = Node.create({
    name: 'character'

})

export const Dialogue = Node.create({
    name: 'dialogue'

})

//^ after Second Character
export const DualDialogue = Node.create({
    name: 'dualDialogue'

})

//~, Should Render Italic with / on either end (Fountain Syntax is annoyingly vague on this)
export const Lyric = Italic.extend({
    name: 'lyric',

    addInputRules() {
        return [
            markInputRule({
                find: /^\~[^]+?$/,
                type: this.type
            })
        ]
    },

    addPasteRules() {
        return [
            markPasteRule({
                find: /^\~[^]+?$/,
                type: this.type
            })
        ]
    },

    //Enclose Lyrics in /
    markdownOptions: {
        htmlReopen: {
            open: '<em>/',
            close: '/</em>',
        },
    }
})

//===
export const PageBreak = Node.create({
    name: 'pageBreak',
    renderHTML() {
        return ['br', { class: 'page-break' }]
    }
})

//. (Scene Numbers After are Alphanumerics surrounded by #)
export const SceneHeading = Node.create({
    name: 'sceneHeading',

    markdownTokenizer: {
        name: 'sceneHeading',
        level: 'block',

        start: src => {
            return src.indexOf('.')
        },

        tokenize: (src, tokens, lexer) => {

            const match = /^.([^a-z0-9]{3,})$/.exec(src)

            if (!match) {
                return undefined
            }

            return {
                type: 'sceneHeading',
                raw: match[0],
                text: match[1],
                tokens: lexer.inlineTokens(match[1])
            }
        }

    },

    parseMarkdown: (token, helpers) => {
        return helpers.applyMark('sceneHeading', helpers.parseInline(token.tokens || []))
    }
})

//>
export const Transition = Node.create({
    
    name: 'transition',

    markdownTokenizer: {
        name: 'transition',
        level: 'block',

        start: src => {
            return src.indexOf('>')
        },

        tokenize: (src, tokens, lexer) => {

            const match = /^>([^<]+?)$/.exec(src)

            if (!match) {
                return undefined
            }

            return {
                type: 'transition',
                raw: match[0],
                text: match[1],
                tokens: lexer.inlineTokens(match[1])
            }
        }

    },

    parseMarkdown: (token, helpers) => {
        return helpers.applyMark('transition', helpers.parseInline(token.tokens || []))
    }

})

//Remove Underline Markdown from Italic to match Fountain Syntax
export const FountainItalic = Italic.extend({
    
    addInputRules() {
        return [
            markInputRule({
                find: starInputRegex,
                type: this.type
            })
        ]
    },

    addPasteRules() {
        return [
            markPasteRule({
                find: starInputRegex,
                type: this.type
            })
        ]
    }
})

//Change Underline Markdown to match Fountain Syntax
export const FountainUnderline = Underline.extend({
    markdownTokenizer: {
    name: 'underline',
    level: 'inline',
    start(src) {
      return src.indexOf('__')
    },
    tokenize(src, _tokens, lexer) {
      const rule = /^(\_\_)([\s\S]+?)(\_\_)/
      const match = rule.exec(src)

      if (!match) {
        return undefined
      }

      const innerContent = match[2].trim()

      return {
        type: 'underline',
        raw: match[0],
        text: innerContent,
        tokens: lexer.inlineTokens(innerContent),
      }
    },
  }
})


//editor.setFontFamily('Courier Prime')



const Fountain = Extension.create({
    name: 'fountain',

})