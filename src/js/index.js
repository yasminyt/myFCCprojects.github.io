const Projects = [
  { title: 'Responsive Web Design Projects',
    github: 'https://github.com/yasminyt/myprofile/tree/master/responsive-web-design',
    url: 'responsive-web-design',
    details: [
      { img: 'product-landing-page.PNG', title: 'Product Landing Page', href: 'product-landing.html' },
      { img: 'tribute-page.PNG', title: 'Tribute Page', href: 'tribute.html' },
      { img: 'technical-document-page.PNG', title: 'Technical Documentation Page', href: 'technical-documentation.html' },
      { img: 'survey-form.PNG', title: 'Survey Form Page', href: 'survey-form.html' }
    ]
  },
  {
    title: 'Front End Libraries Projects',
    github: 'https://github.com/yasminyt/myprofile/tree/master/front-end-libraries',
    url: 'front-end-libraries',
    details: [
      { img: 'random-quote.PNG', title: 'Random Quote Machine', href: 'random-quote.html'},
      { img: 'calculator.PNG', title: 'JavaScript Calculator', href: 'calculator.html'}
    ]
  },
  {
    title: 'CSS Zen Garden done by self',
    github: 'https://github.com/yasminyt/csszengardenByself.github.io',
    details: [
      { img: 'csszengarden.png', title: 'CSS Zen Garden Mix', href: 'https://yasminyt.github.io/csszengardenMix/'}
    ]
  }
]

$(function() {
  showProjects()
})

function showProjects() {
  let content = ''
  Projects.forEach(item => {
    content += `<h2>${item.title}</h2>`
    content += `<div><i class='githubIcon'></i><a href='${item.github}' target='_blank'>Source Url</a></div>`
    content += "<div class='details'>"
    content = appendItem(item.url, item.details, content)
  })
  $('.albumns').html(content)
}

function appendItem(url, detailArr, content) {
  detailArr.forEach(item => {
    if (url)
      content += `<figure><a href='./${url}/${item.href}' target='_blank'>`
    else
      content += `<figure><a href='${item.href}' target='_blank'>`
    content += `<img src='./src/img/${item.img}' alt='${item.title}'>`
    content += `<figcaption>${item.title}</figcaption></a></figure>`
  })
  content += '</div>'
  return content
}