const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

function generateRandomTeamName() {
  const randomTeamName = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals], // Customize the dictionaries as needed
    length: 2, // Number of words in the team name (adjust as needed)
    separator: ' ', // Separator between words (you can use '' for no separator)
  });

  return randomTeamName;
} 

// Lambda handler function
exports.handler = async (event) => {
  try {
    const teamName = generateRandomTeamName();

    return {
      statusCode: 200,
      body: JSON.stringify({ teamName }),
    };
  } catch (error) {
    console.error('Error generating random team name:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error generating random team name' }),
    };
  }
};
