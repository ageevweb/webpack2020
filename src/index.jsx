import * as $ from 'jquery'
import Post from '@models/post'

import React from 'react'
import {render} from 'react-dom'

import '@/babel'

import '@/styles/index.css'
import '@/styles/lessStyle.less'
import '@/styles/scssStyle.scss'



const post = new Post('Webpack post Title')

// $('pre').html(post.toString())

console.log(post.toString())



// react

const App = () => (
  <div className="container">
    <h1>Webpack 2020</h1>

    <hr/>

    <div className="box">
      <h2>LESS</h2>
    </div>

    <div className="box2">
      <h2>SCSS</h2>
    </div>

    <pre/>
  </div>
)
render(<App />, document.getElementById('app'))
