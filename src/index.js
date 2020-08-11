import * as $ from 'jquery'
import Post from '@models/post'

import '@/styles/index.css'

const post = new Post('Webpack post Title')

$('pre').html(post.toString())

console.log(post.toString())