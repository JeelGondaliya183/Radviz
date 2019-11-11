# Radviz
Clustering of the wine data sets and visualizing it using Radviz graph 

### Instruction to execute the Application:

1.	Extract the .zip file and Install the required packages for the backend server file.
	-	pip install -U flask –user
	-	pip install -U flask-cors –user
	-	pip install -U pandas –user
	-   pip install -U scikit-learn --user
	
2.  Copy all the csv files - whinequality-red.csv, winequality-white.csv, iris.csv to the same folder as datasets.py .
	
3.	Execute the server file datasets.py using the command python datasets.py from command-line. This will read the three csv files.

4.	Host the file 'index.html'. 	Use browser to view the visualization using http://localhost:8080/index.html (assusming default port is 8080)

5.  Select any dataset from the dropdown menu to see the data dispayed in the Radviz graph and click on the clustering button to see the clustered data. Adjust color scale to change the color opacity.

6.	(Optional) Execute the file clustering.py using google Colaboratory / Jupiter Notebook to get the .csv files which is used in the Frontend for visualisation.(since it is already attached)
