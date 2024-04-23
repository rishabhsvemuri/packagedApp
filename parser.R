library(jsonlite)

# Function to extract parameters of a specified ggplot function and save them to a JSON file
extract_params_to_json <- function(gg_function, json_file_path) {
  # Get the formal arguments of the specified ggplot function
  gg_formals <- formals(gg_function)
  
  # Convert the formal arguments to a named list
  params_list <- as.list(gg_formals)
  
  # Write parameters to a JSON file
  jsonlite::write_json(params_list, json_file_path)
}

# Example usage
# Define the ggplot function to use
gg_function <- ggplot

# Call the function with the chosen ggplot function and specify the output JSON file
extract_params_to_json(gg_function, "ggplot_params.json")