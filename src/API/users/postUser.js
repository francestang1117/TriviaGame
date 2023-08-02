const postUser = (formData) =>
{
    fetch('https://f3jyjh5gh8.execute-api.us-east-1.amazonaws.com/Naveen/postprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
    .then((response) => {
        if (response.ok) {
          console.log('Form data sent successfully!');
        } else {
          console.error('Failed to send form data:', response.status, response.statusText);
        }
        return response;
    })
    .catch((error) => {
        console.error('Error sending form data:', error);
    });
};

export default postUser;