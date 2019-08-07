import csv
import json
import numpy
import pandas as pd
from flask import Flask
from flask import request, jsonify, redirect, url_for
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

dbs = [
    {
        'name': 'White Wine Quality',
    },
    {
        'name': 'Red Wine Quality',
    },
    {
        'name' : 'iris'
    }
]

csv_files = {
    'White Wine Quality': {
        'dname': 'Wine_White_Cluster.csv',
    },
    'Red Wine Quality': {
        'dname': 'Wine_Red_Cluster.csv',
    },
    'iris' : {
        'dname' : 'iris.csv'
    }
}

def load_data(name):
    results = []

    for p_id, p_info in csv_files.items():
        print("\nPerson ID:", p_id)
        if(name == p_id):
            for key in p_info:
                print(key + ':', p_info[key])
                with open(p_info[key]) as csvfile:
                    csv_file = csv.reader(csvfile, quoting=csv.QUOTE_NONNUMERIC) # change contents to floats
                    for row in csv_file: # each row is a list  
                        results.append(row)
                return results


@app.route('/datasets', methods=['GET'])
@cross_origin()
def get_datasets():
    return jsonify(dbs)


@app.route('/datasets/load', methods=['GET'])
@cross_origin()
def get_dataset_load():
    name = request.args.get('name')
    
    for d in dbs:
        if d['name'] == name:
            return jsonify(load_data(name))
    return f"Dataset '{name}' not found", 400


if __name__ == '__main__':
   app.run(debug = True)
