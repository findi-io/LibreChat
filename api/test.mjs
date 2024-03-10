import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { generateHTML,generateJSON } from '@tiptap/html'
import TurndownService from 'turndown'
import markdownit from 'markdown-it'


const json = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Example ',
          },
          {
            type: 'text',
            marks: [
              {
                type: 'bold',
              },
            ],
            text: 'Text',
          },
        ],
      },
    ],
  }
let window = {}
const html = generateHTML(json, [
  Document,
  Paragraph,
  Text,
  Bold,
  // other extensions …
])
console.log(html)

var turndownService = new TurndownService()
var markdown = turndownService.turndown(html)
console.log(markdown)
const md = markdownit()
const result = md.render(markdown);
console.log(result)
const json2 = generateJSON(result, [
  Document,
  Paragraph,
  Text,
  Bold,
  // other extensions …
])
console.log(JSON.stringify(json2))