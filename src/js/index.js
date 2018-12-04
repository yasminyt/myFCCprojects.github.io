const Projects = [
  { title: 'Responsive Web Design Projects',
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
    url: 'front-end-libraries',
    details: [
      { img: 'random-quote.PNG', title: 'Random Quote Machine', href: 'random-quote.html'},
      { img: 'calculator.PNG', title: 'JavaScript Calculator', href: 'calculator.html'}
    ]
  }
]

$(function() {
  showProjects()
})

function showProjects() {
  let content = ''
  Projects.forEach(item => {
    content += `<h2>${item.title}</h2><div class='details'>`
    content = appendItem(item.url, item.details, content)
  })
  $('.albumns').html(content)
}

function appendItem(url, detailArr, content) {
  detailArr.forEach(item => {
    content += `<figure><a href='./${url}/${item.href}' target='_blank'>`
    content += `<img src='./src/img/${item.img}' alt='${item.title}'>`
    content += `<figcaption>${item.title}</figcaption></a></figure>`
  })
  content += '</div>'
  return content
}