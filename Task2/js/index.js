var apiResponse = {
    "data": [
    {
    "city": "New York",
    "state": "NY",
    "population": 8175133,
    "density": 10.4311
    },
    {
    "city": "San Francisco",
    "state": "CA",
    "population": 805235,
    "density": 6.6589
    },
    {
    "city": "Boston",
    "state": "MA",
    "population": 645149,
    "density": 5.1434
    }
    ]
    };

    // could also just keep it in the HTML/DOM element...
    // using a simple hash since only using city + density 
    // - no need for an object array - which brings challenges with checking for collisions
    var main_data_store = {}; 
    function loadData()
    {
        if (!apiResponse || !apiResponse.data || !apiResponse.data.length)
        {
            console.error("Um. Sorry, but no loaded data...");
            return;
        }

        // trade-off note: we can keep an array or an object around
        // - if object, then loop to create an array later or do some contortions to sort
        // - if array, then have to loop before each insertion to check if already there
        
        main_data_store = {}; // reinit
        for (var ix in apiResponse.data)
        {
            var cityInfo = apiResponse.data[ix];
            
            //console.log("working on City: ", cityInfo); // sanity check

            var cityName = cityInfo.city || "Unknown";
            
            var density = getDensityOfProperForm(cityInfo.density);

            main_data_store[cityName] = density;
        }

        //console.log("leaving loadData with: ", main_data_store); // sanity check

    } // load-Data

    // because used multiple places... this way we can update 1 spot as needed
    function getDensityOfProperForm(density)
    {
        // Note: Number is useful if that's want we want as output, 
        // but remove it if want to show the 1 decimal precision - 1.99 => 2 or 2.0
        return (Number(parseFloat(density || 0).toFixed(1)) || 0);

    } // get-DensityOfProperForm

    function updateCityData(e)
    {
        e.preventDefault(); // we do everything we need in here, so...

        var cityName = $("#city_name").val();
        var density = getDensityOfProperForm($("#density_value").val());

        if (!cityName)
        {
            // TO-DO: more error handling to your heart's content...
            console.error("No valid data");
            return;
        }

        // TO-DO: more error handling - such as adjusting city name length
        // we could also complain if we got bad characters/etc

        main_data_store = main_data_store || {}; // init jic was clobbered/not init'd
        
        //console.log("ready to update: ", cityName, density ); // sanity check

        // if main_data_store was an array, would use findIndex and then splice to replace
        main_data_store[cityName] = density;

        setDataIntoView();

        //console.log("leaving update-CityData with: ", main_data_store); // sanity check

        // clear fields...
        $("#city_name,#density_value").val("");

        return;

    } // update-CityData

    // default to sorting first
    function setDataIntoView()
    {
        if (!main_data_store)
        {
            return;
        }
        var arrayForSortin = [];
        for(var cityName in main_data_store)
        {
            if (!!cityName) // jic
            {
                arrayForSortin.push(cityName);
            }
        } // for

        arrayForSortin.sort(); // simple sort on just city names

        // if we had an object array... sort(function(a,b){return (!!a && !!b) ? a["city"].localeCompare(b["city"]) : 0});

        // out with the old, in with the new
        $(".cities-table").html("");

        for(var ix in arrayForSortin)
        {
            // TO-DO: just in case, we can do some additional data validation here
            var cityName = arrayForSortin[ix];
            var city_obj = main_data_store[cityName];

            //console.log("showing city: ", cityName, main_data_store[cityName]); // sanity check

            // add the row in a single line - could be done in other ways
            // we could also add classnames here if useful
            var newRow = '<tr><td>' + cityName + '</td><td>' + main_data_store[cityName] + '</td></tr>';
            $(".cities-table").append(newRow);

        } // for

    } // set-DataIntoView

    // let the page do it's thing first...
    $( document ).ready(function() {
        $("#simple_form").on("submit", updateCityData);

        loadData();

        // could have called this from within load-Data() 
        // or used a promise/callback to do this async'ly
        setDataIntoView();
    });