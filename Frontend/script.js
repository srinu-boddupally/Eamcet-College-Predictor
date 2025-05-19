document.getElementById('submitButton').addEventListener('click', async function () {
  const rank = document.getElementById('rank').value;
  const category = document.getElementById('category').value;
  const gender = document.getElementById('gender').value;
  const branchName = document.getElementById('branch').value;
  if (!rank || !category || !gender || !branchName) {
    alert('Please fill all the fields');
    return;
  }
  const categoryGender = `${category} \n${gender}`;
  document.querySelector('.loading').style.display = 'block';
  document.getElementById('results').innerHTML = '';
  try {
    const response = await fetch('https://eamcet-college-predictor-api2.vercel.app/api/predict-colleges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rank, categoryGender, branchName })
    });
    const data = await response.json();
    if (response.ok) {
      const resultBox = document.getElementById('results');
      const phases = Object.keys(data);
      if (phases.length === 0) {
        resultBox.innerHTML = '<p>No results found.</p>';
      } else {
        phases.forEach(phase => {
          const list = data[phase];
          const title = document.createElement('h3');
          title.textContent = phase;
          resultBox.appendChild(title);
          list.forEach(college => {
            const div = document.createElement('div');
            div.className = 'college-item';
            div.innerHTML = `
              <strong>${college['Institute Name']}</strong>
              <br>Branch: ${college['Branch Name']}
              <br>Location: ${college.Place}
              <br>Fee: ${college['Tuition Fee']}
              <br>Closing Rank: ${college[categoryGender] || 'N/A'}
            `;
            resultBox.appendChild(div);
          });
        });
      }
    } else {
      document.getElementById('results').innerHTML = `<p>Error: ${data.error}</p>`;
    }
  } catch (error) {
    document.getElementById('results').innerHTML = `<p>Error: ${error.message}</p>`;
  } finally {
    document.querySelector('.loading').style.display = 'none';
  }
});
