const recentTable = document.getElementById('recent-table')
const recentData = [0,1,2,3,4];

recentData.map(()=>{
    const recentList = document.createElement('tr')
    recentList.className = 'recent-list'
    recentList.innerHTML = 
    `<td class='recent-items'>
        <button>Button</button>
    </td>`
    recentTable.append(recentList)
})