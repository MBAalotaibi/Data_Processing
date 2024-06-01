// Import required modules
const fs = require('fs'); // FileSystem module for file operations
const path = require('path'); // Path module for handling and transforming file paths


// Define a class for processing data
class Data_Processing {
    // Constructor initializes the class attributes
    constructor() {
        this.rawUserData = []; // Array to store raw user data
        this.cleaned_user_data = []; // Array to store cleaned user data
        this.originalDataCount = 0; // Counter for the original number of data entries
        this.alteredDataCount = 0; // Counter for the number of data entries altered during cleaning
    }

    // Method to load raw user data from a CSV file
    load_CSV(filename = "Raw_User_Data") {
        filename += '.csv'; // Append '.csv' extension to the filename
        try {
            // Synchronously read the content of the CSV file
            const data = fs.readFileSync(filename, 'utf8');
            this.raw_user_data = data;  // Store the raw data in the class attribute
            console.log(this.raw_user_data); // Output the raw data to the console
        } catch (error) {
            // Handle any errors that occur during file reading
            console.error(`Error loading CSV file: ${error}`);
        }
    }

    // Method to format raw user data into a more structured and clean format
    format_data() {
          // Split raw user data by newline, removing empty lines
        const lines = this.raw_user_data.split('\n').filter(line => line.trim() !== '');
          // Split raw user data by newline, removing empty lines
        this.originalDataCount = lines.length;
        
         // Arrays to handle titles with and without periods for normalization
        const titlesWithPeriods = ["Mrs.", "Mr.", "Miss.", "Ms.", "Dr."];
        // Remove periods from titles for consistent comparison
        const titlesWithoutPeriods = titlesWithPeriods.map(title => title.slice(0, -1)); // Remove periods
    
      
        // Mapping of textual ages to numeric values
        const ageMap = {
            "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
            "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
            "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14, "fifteen": 15,
            "sixteen": 16, "seventeen": 17, "eighteen": 18, "nineteen": 19, "twenty": 20,
            "twenty-one": 21, "twenty-two": 22, "twenty-three": 23, "twenty-four": 24,
            "twenty-five": 25, "twenty-six": 26, "twenty-seven": 27, "twenty-eight": 28, "twenty-nine": 29,
            "thirty": 30, "thirty-one": 31, "thirty-two": 32, "thirty-three": 33, "thirty-four": 34, "thirty-five": 35, "thirty-six": 36, "thirty-seven": 37, "thirty-eight": 38,
            "thirty-nine": 39, "forty": 40, "forty-one": 41, "forty-two": 42, "forty-three": 43,
            "forty-four": 44, "forty-five": 45, "forty-six": 46, "forty-seven": 47, "forty-eight": 48,
            "forty-nine": 49, "fifty": 50, "fifty-one": 51, "fifty-two": 52, "fifty-three": 53,
            "fifty-four": 54, "fifty-five": 55, "fifty-six": 56, "fifty-seven": 57, "fifty-eight": 58,
            "fifty-nine": 59, "sixty": 60, "sixty-one": 61, "sixty-two": 62, "sixty-three": 63,
            "sixty-four": 64, "sixty-five": 65, "sixty-six": 66, "sixty-seven": 67, "sixty-eight": 68,
            "sixty-nine": 69, "seventy": 70, "seventy-one": 71, "seventy-two": 72, "seventy-three": 73,
            "seventy-four": 74, "seventy-five": 75, "seventy-six": 76, "seventy-seven": 77, "seventy-eight": 78,
            "seventy-nine": 79, "eighty": 80, "eighty-one": 81, "eighty-two": 82, "eighty-three": 83,
            "eighty-four": 84, "eighty-five": 85, "eighty-six": 86, "eighty-seven": 87, "eighty-eight": 88,
            "eighty-nine": 89, "ninety": 90, "ninety-one": 91, "ninety-two": 92, "ninety-three": 93,
            "ninety-four": 94, "ninety-five": 95, "ninety-six": 96, "ninety-seven": 97, "ninety-eight": 98,
            "ninety-nine": 99, "one hundred": 100
            
        };
    
        // Process each line to extract and format data
        this.formatted_user_data = lines.map(line => {
            // Split each line by comma and trim whitespace
            const [titleFullName, dob, ageStr, email] = line.split(',').map(part => part.trim());
    
             // Initialize variables for title and remaining name
            let title = "";
            let remainingName = titleFullName;
    
            // Look for titles with periods and preserve them if found
            for (let t of titlesWithPeriods) {
                if (titleFullName.startsWith(t)) {
                    title = t; // Preserve the title with period
                    remainingName = titleFullName.slice(t.length).trim();
                    break;
                }
            }
    
            // If no title with period was found, check for titles without periods
            if (!title) {
                for (let t of titlesWithoutPeriods) {
                    if (titleFullName.startsWith(t)) {
                        title = t; // Title without period
                        remainingName = titleFullName.slice(t.length).trim();
                        break;
                    }
                }
            }


             // Mapping of month names to their numeric values
             const monthMap = {
              "January": "01", "February": "02", "March": "03",
              "April": "04", "May": "05", "June": "06",
              "July": "07", "August": "08", "September": "09",
              "October": "10", "November": "11", "December": "12"
            };

            // Parse the date of birth, handling different formats
             let day, month, year;
             if (dob.includes('/')) {
              // Handle dob in format "DD/MM/YYYY"
             [day, month, year] = dob.split('/');
              } else {

            [day, month, year] = dob.split(' '); // Assuming format like "01 January 1990"
             month = monthMap[month] || month; // Convert month from text to numeric if needed
             }
               day = day.padStart(2, '0');
              month = month.padStart(2, '0');
              // Handle two-digit year, assuming a cutoff at year 50 for 20th vs. 21st century
              year = year.length === 2 ? (parseInt(year) >= 25 ? `19${year}` : `20${year}`) : year;
             const formattedDOB = `${day}/${month}/${year}`;

              

            
            // Split the remaining name into parts for first, middle, and last names
            let nameParts = remainingName.split(/\s+/);
            let firstName = nameParts.shift() || "";
            let surname = nameParts.pop() || "";
            let middleName = nameParts.join(' ') || "";
    

            
            
            // Convert age from text to number, falling back to the map or parse as integer
            const age = isNaN(parseInt(ageStr, 10)) ? (ageMap[ageStr.toLowerCase()] || "") : parseInt(ageStr, 10);
    
            // Return an object with the structured and cleaned data
            return {
                title, // Return the title as-is, including periods
                first_name: firstName,
                middle_name: middleName,
                surname: surname,
                date_of_birth: formattedDOB,
                age,
                email // Use the provided email as is
            };
        });

        // Log the formatted user data for debugging
        console.log('Formatted User Data:', JSON.stringify(this.formatted_user_data, null, 2));
    }
    
    clean_data() {
         // Define titles with and without periods
         const titlesWithPeriods = ["Mrs.", "Mr.", "Miss.", "Ms.", "Dr."];
         const titlesWithoutPeriods = titlesWithPeriods.map(title => title.slice(0, -1)); 
     
         this.cleaned_user_data = this.formatted_user_data.map(user => {
             let { title, first_name, middle_name, surname, date_of_birth, age, email } = user;
     
             // Remove period from the title if present
             if (title.endsWith('.')) {
                 title = title.slice(0, -1); // Remove the last character, which is a period
             }
               

              // Early extraction of names from email if first_name or surname are missing
              if ((!first_name || !surname) && email.includes('@')) {
              const emailParts = email.split('@')[0].split('.');
              if (emailParts.length >= 2) {
                first_name = first_name || emailParts[0];
                surname = surname || emailParts.slice(1).join(' ');
            }
        }

        // Define a method to capitalise names, handling both hyphens and apostrophes
      const capitalizeName = name => {
        // First, capitalise parts separated by hyphens
        let hyphenHandled = name.split('-').map(part =>
            // Then, within each part, capitalize parts separated by apostrophes
            part.split('\'').map(this.capitalize).join('\'')
        ).join('-');

        // Ensure the entire name is capitalized correctly, including the first letter
        return this.capitalize(hyphenHandled);
    };
          

      const today = new Date(2024, 1, 29); // Set "today" to March 3, 2024

      // Parse the date_of_birth to get day, month, and year
      const [day, month, year] = date_of_birth.split('/').map(num => parseInt(num, 10));
      const birthDate = new Date(year, month - 1, day);
      
      // Calculate the difference in years to get an initial age
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      
      // Check if we've passed the birthdate this year; if not, decrement the age
      const hasBirthdayPassed = today.getMonth() > birthDate.getMonth() || 
                               (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
      if (!hasBirthdayPassed) {
          calculatedAge--;
      }
      
      // Convert the provided age to an integer for comparison
      const providedAgeInt = parseInt(age, 10);
      
      // Now, instead of merely checking if providedAge is within 1 year of calculatedAge,
      // we directly use the calculatedAge, as it's accurately reflecting the current date relative to the birthdate.
      // This approach ensures we only use the providedAge if it exactly matches the calculated condition.
      if (providedAgeInt !== calculatedAge) {
          age = calculatedAge; // Update age to the correctly calculated value
      } else {
          // If providedAge matches the calculatedAge or if there's no significant discrepancy, keep the providedAge
          age = providedAgeInt;
      }
      
            // Assuming formatDate, validateAndStandardizeEmail exist
            date_of_birth = this.formatDate(date_of_birth);

       
        email = this.validateAndStandardizeEmail(email, first_name, surname);

        return { title, first_name, middle_name, surname, date_of_birth, age, email };
    });

    console.log('Cleaned User Data:', JSON.stringify(this.cleaned_user_data, null, 2));
}
    // Method to validate and standardize email addresses
    validateAndStandardizeEmail(email, firstName, lastName) {
        // Regex to match valid email formats
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        // Special domain that is considered valid without modification
        const specialDomain = "Liverpool.ac.uk";
        // Initialize finalEmail with the input email
        let finalEmail = email;
        // If email is invalid or missing, generate a standardized email using first and last names
        if (!email || !emailRegex.test(email)) {
            finalEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
        }
        // If email is valid and ends with the special domain, keep it as is
        if (email.endsWith(specialDomain) && emailRegex.test(email)) {
            finalEmail = email;
        } else if (!emailRegex.test(email) || this.cleanedUserData.some(user => user.email === finalEmail)) {
            // If email doesn't match the special domain or already exists in cleanedUserData,
            // append a numerical ID to make it unique
            let counter = 1;// Start counter at 1 
            while (this.cleanedUserData.some(user => user.email === finalEmail)) {
                // Generate a new email with the counter appended to ensure uniqueness
                finalEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${counter}@example.com`;
                counter++;// Increment counter for the next potential conflict
            }
        }
        // Return the final standardized or unique email address
        return finalEmail;
    }
    
    // Method to format a date string into a standardized format (DD/MM/YYYY)
    formatDate(dateString) {
        // Array of month names for conversion from name to number
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
         // Regular expression to extract day, month, and year from the dateString
        const dateParts = dateString.match(/(\d{1,2})[\/\- ](\d{1,2}|[a-zA-Z]+)[\/\- ](\d{2,4})/);
        // Check if the date string matches the expected format
        if (dateParts) {
            // Ensure day is two digits, padding with 0 if necessary
            let day = dateParts[1].padStart(2, '0');
            let month = dateParts[2]; // Could be a number or a month name
            let year = dateParts[3]; // Year part of the date
             
             // If month is a name, convert it to its numeric value, otherwise ensure it is two digits
            if (isNaN(month)) {

                // Convert month name to its corresponding numeric value and pad with 0 if necessary
                month = (months.indexOf(month) + 1).toString().padStart(2, '0');
            } else {
                 // Ensure numeric month value is two digits
                month = month.padStart(2, '0');
            }

            // Handle two-digit years, assuming any year less than 50 belongs to the 21st century
            if (year.length === 2) {
                year = parseInt(year) < 50 ? `20${year}` : `19${year}`;
            }

            // Return the formatted date string
            return `${day}/${month}/${year}`;
        }
         
        // If dateString doesn't match the expected format, return it unchanged
        return dateString;
    }

    
    // Method to capitalize the first letter of a given word and make the rest lowercase
    capitalize(word) {
      // Returns the word with the first character converted to uppercase and the rest to lowercase
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    
    //find the most common surname(s) in the cleaned user data
    most_common_surname() {
        const surnameCounts = {}; // Object to hold surname counts

        // Iterate over each user in the cleaned data
        this.cleaned_user_data.forEach(user => {
            const surname = user.surname.toLowerCase(); // Convert surname to lowercase to ensure consistent counting
            // Increment the count for the surname or initialize it to 1 if it hasn't been encountered yet
            surnameCounts[surname] = (surnameCounts[surname] || 0) + 1;
        });
    
        // Find the highest count of any surname in the dataset
        const maxCount = Math.max(...Object.values(surnameCounts));
        // Find all surnames that have the highest count
        const mostCommonSurnames = Object.keys(surnameCounts).filter(surname => surnameCounts[surname] === maxCount);
    
         // Capitalize the most common surnames before returning them
        // This uses the capitalize method defined earlier to ensure the first letter of each surname is uppercase
        return mostCommonSurnames.map(surname => this.capitalize(surname));
    }
    
    
    // Method to calculate the average age of users in the cleaned data
    average_age() {
        // Sum all ages in the cleaned user data to get the total age
        const totalAge = this.cleaned_user_data.reduce((sum, user) => sum + user.age, 0);
         // Calculate the average age
        const average = totalAge / this.cleaned_user_data.length;
        // Round the average to one decimal place
        const roundedAverage = Math.round(average * 10) / 10;
        return roundedAverage.toFixed(1);  // Return the rounded average as a string formatted to one decimal place
    }
    
    

    //find the youngest doctor in the cleaned user data
    youngest_dr() {
        // Filter the cleaned data for users with the title "Dr" or "Dr." to get an array of doctors
        const doctors = this.cleaned_user_data.filter(user => user.title === 'Dr' || user.title === 'Dr.');
        // If there are no doctors in the dataset
        if (doctors.length === 0) {
            // Return a message indicating there are no doctors if the doctors array is empty
            return "No doctors in the dataset";
        }
        // Find the youngest doctor
        const youngestDoctor = doctors.reduce((youngest, current) => {
            return youngest.age < current.age ? youngest : current;
        }, doctors[0]);
    
        // Return the full user object of the youngest doctor
        return {
            title: youngestDoctor.title,
            first_name: youngestDoctor.first_name,
            middle_name: youngestDoctor.middle_name || '', // Ensure middle_name is included, even if empty
            surname: youngestDoctor.surname,
            date_of_birth: youngestDoctor.date_of_birth,
            age: youngestDoctor.age,
            email: youngestDoctor.email
        };
    }
    
    
    //identify the most common birth month among users
    most_common_month() {
    const monthCounts = {}; // Object to hold the count of occurrences for each month
    // Iterate over each user in the cleaned data
    this.cleaned_user_data.forEach(user => {
        const month = user.date_of_birth.split('/')[1]; // Extract the month from the date_of_birth field
        monthCounts[month] = (monthCounts[month] || 0) + 1;
    });

    // Determine the month with the highest occurrence
    const mostCommonMonth = Object.keys(monthCounts).reduce((a, b) => monthCounts[a] > monthCounts[b] ? a : b);
    return parseInt(mostCommonMonth, 10); // Parses the month string to an integer to remove leading zeros
}
 

    //calculate the percentage of titles among users
    percentage_titles() {
        // Define all titles including a blank one for those without any title
        const validTitles = ["Mr", "Mrs", "Miss", "Ms", "Dr", ""];
        let titleCounts = { "Mr": 0, "Mrs": 0, "Miss": 0, "Ms": 0, "Dr": 0, "": 0 };

        // Iterate over cleaned_user_data to count titles
        this.cleaned_user_data.forEach(user => {
            let title = user.title || ""; // Use an empty string for users without a title
            // Ensure the title is one of the expected values
            if (title in titleCounts) {
                titleCounts[title]++;
            }
        });
    
        const totalUsers = this.cleaned_user_data.length; // Total number of users
        // Calculate percentages for each title 
        let titlePercentages = validTitles.map(title => {
            let percentage = (titleCounts[title] / totalUsers) * 100;
            // Use Bankers rounding to the nearest integer
            return Math.round(percentage);// Round to the nearest integer
        });
    
        return titlePercentages;
    }
    
    

    // Method to calculate the percentage of data values that were altered during cleaning
     percentage_altered() {
        
        // Assume each user record is checked for alterations in 4 fields (title, name, dob, email)
         const totalChecks = this.cleaned_user_data.length * 4;
          // Calculate the percentage of values altered based on the count of alterations
         const percentageAltered = (this.alteredDataCount / totalChecks) * 100;
         return percentageAltered.toFixed(3); // Return the percentage formatted to three decimal places
        
    }

}  