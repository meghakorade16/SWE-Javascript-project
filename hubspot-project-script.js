//You can run this file to the results. The easiest way to run could be google console. 
// 1. Open google tab
// 2. Hit F12 to open console
// 3. Paste the code(Ctrl C + Ctrl V)
// 4. Hit enter button to see results

function getPartnersPerCountry(partners) {
    let partnersPerCountry = new Map();
    partners.forEach(partner => {
        if (!partnersPerCountry.has(partner.country))
            partnersPerCountry.set(partner.country, []);

        partnersPerCountry.get(partner.country).push(partner);
    })

    return partnersPerCountry
}

function getMostPopularDate(partners, country) {
    let dateToParnters = new Map();
  partners.forEach(partner => {
    partner.availableDates.forEach(date => {

        if (!dateToParnters.has(date))
            dateToParnters.set(date, new Set());

        dateToParnters.get(date).add(partner.email);
    })
  })


  let mostPopularFirstDay = '';
  let mostPopularCount = 0;
  let attendees = null;

  dateToParnters.forEach((partners, date, map) => {
    let secondDay = new Date(date);
    secondDay.setDate(secondDay.getDate() + 1)
    const secondDayString = secondDay.toISOString().split('T')[0];

    if (!map.has(secondDayString)) return;

    secondDayParnters = map.get(secondDayString);
    let currentMaxSet = new Set([...partners].filter(i => secondDayParnters.has (i)))
    let currentMax = currentMaxSet.size;

    if (currentMax < mostPopularCount || currentMax <= 0) return

    if (currentMax > mostPopularCount) {
        mostPopularCount = currentMax;
        mostPopularFirstDay = date;
        attendees = currentMaxSet;
        return;
    }

    // dates with equal non-zero partners
    const currentDate = new Date(date);
    const currentMaxDate = new Date(mostPopularFirstDay);

    if (currentDate.getTime() < currentMaxDate.getTime()) {
        mostPopularFirstDay = date;
        attendees = currentMaxSet;
    }
  });

  return {
    attendeeCount: mostPopularCount,
    attendees: attendees == null ? [] : Array.from(attendees),
    name: country,
    startDate: mostPopularFirstDay ? mostPopularFirstDay : null,
  }
}


function runProgram(input) {

    const partnersPerCountry = getPartnersPerCountry(input.partners);
    let response = {countries: []};

    partnersPerCountry.forEach((partners, country, map) => {
        response.countries.push(getMostPopularDate(partners, country));
    })

    return response;
}

async function executeMain() {
    response = await fetch('https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=35319657d7f98ee7837dfa471093')
    .then(response =>response.json())
    .then(response => runProgram(response))
    .then(response => {
        fetch('https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=35319657d7f98ee7837dfa471093', {
            method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
            body: JSON.stringify(response)
          }).then(response => response.json())
          .then(response => console.log(response));
    })
}

executeMain();