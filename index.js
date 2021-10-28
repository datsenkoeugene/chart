import data from './data.js'

const chartOptions = {
    chartWidth: 800,
    chartHeight: 500,
    chartMargin: 110,
    urlSvg: 'http://www.w3.org/2000/svg',
    chartTitle: '100% Stacked column chart',
    chartSubtitle: 'The ratio of salaries of Ukrainian developers - summer 2020, by city in Java and JavaScript'
}

const getValuesByKey = (data, keyName) => data.map(item => item[keyName])

const createChartText = (x, y, title) => `<text x="${x}" y="${y}">${title}</text>`

const createAxis = (x1, x2, y1, y2) => `<line x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}"></line>`

const createRect = (x, y, width, height, bgColor) =>
    `<rect x="${x - width / 2}" y="${y}" width="${width}" height="${height}" fill="${bgColor}" class="rect" />`

const createCircle = (cx, cy, r, bgColor) =>
    `<circle cx="${cx}" cy="${cy}" fill="${bgColor}" r="${r}"/>`

const createAxisXText = (x, y, index, step, title) =>
    `<text transform="translate(${index * step + x}, ${y}) rotate(90)">${title}</text>`

const createChart = (chartContainer, chartOptions, research) => {

    const {chartWidth, chartHeight, chartMargin, urlSvg, chartTitle, chartSubtitle} = chartOptions

    const cities = getValuesByKey(research.categories[0].category, 'city')

    const javaSalary = getValuesByKey(research.dataset[0].data, 'salary')

    const javaScriptSalary = getValuesByKey(research.dataset[1].data, 'salary')

    const step = chartMargin / 2

    const heightColumn = step * 5

    const getPercentSalary = (totalSalary, salary) => Math.round(+(salary * 100 / totalSalary).toFixed(1))

    const totalSalary = javaSalary.map((item, index) => item + javaScriptSalary[index])

    const getPercentHeightColumn = (heightColumn, percentSalary) =>
        Math.round((heightColumn * percentSalary / 100).toFixed(1))

    return chartContainer.innerHTML = `
        <svg version="1.2" width="${chartWidth}" height="${chartHeight}" xmlns="${urlSvg}" class="chart">
            <g class="info">
                ${createCircle(10, 10, 10, '#29c3be')}
                ${createChartText(25, 15, 'JavaScript')}
                ${createCircle(10, 30, 10, '#5d62b5')}
                ${createChartText(25, 35, 'Java')}           
            </g>
            <g class="title">
                ${createChartText(chartWidth / 2, chartMargin - step, chartTitle)}                
            </g>
            <g class="subtitle">
                ${createChartText(chartWidth / 2, chartMargin - step / 2, chartSubtitle)}
            </g>            
            <g class="axis">
                ${createAxis(chartMargin, chartMargin, chartMargin, chartHeight - chartMargin)}
            </g>
            <g class="axis">
                ${createAxis(chartMargin, chartWidth - chartMargin, chartHeight - chartMargin, chartHeight - chartMargin)}
            </g>
            <g>
                ${cities.map((item, index) => `
                    <g class="labels labels-x">
                        ${createAxisXText(chartMargin + step, chartHeight - chartMargin, index, step, item)}                       
                    </g>
                    <g>
                       ${createRect(
                        index * step + chartMargin + step,
                        -heightColumn + chartHeight - chartMargin,
                        40,
                        getPercentHeightColumn(heightColumn, getPercentSalary(totalSalary[index], Math.max(javaSalary[index],
                        javaScriptSalary[index]))),
                        '#29c3be'
                )}
                       ${createRect(
                        index * step + chartMargin + step,
                        -heightColumn + chartHeight - chartMargin + heightColumn - getPercentHeightColumn(heightColumn,
                        getPercentSalary(totalSalary[index], Math.max(javaSalary[index], javaScriptSalary[index]))),
                        40,
                        getPercentHeightColumn(heightColumn, getPercentSalary(totalSalary[index], Math.max(javaSalary[index],
                         javaScriptSalary[index]))),
                        '#5d62b5'
                        )}
                    </g>
                `).join('')}
            </g>
            <g>
                ${[...Array(6).keys()].map((item, index) => `
                    <g class="labels labels-y">
                        ${createChartText(chartMargin, -index * step + chartHeight - chartMargin, `${item * 20}%`)}
                    </g>
                    <g>                       
                        ${createCircle(chartMargin, -index * step + chartHeight - chartMargin, 1)}
                    </g>
                `).join('')}
            </g>
        </svg>
    `
}

createChart(document.body, chartOptions, data)
