import json
from flask import Blueprint, request, render_template
from view.predict import predict_all


static_view_b = Blueprint('web_access', __name__)


@static_view_b.route('/')
def get_login():
    return render_template('authentication-login.html')


@static_view_b.route('/risk-assessment')
def get_risk_assessment():
    return render_template('risk-assessment.html')


@static_view_b.route('/indicator-analyse')
def get_indicator_analyse():
    return render_template('indicator-analyse.html')


@static_view_b.route('/relation-analyse')
def get_relation_analyse():
    return render_template('relation-analyse.html')


@static_view_b.route('/cart')
def get_cart():
    return render_template('cart.html')

@static_view_b.route('/gdbt')
def get_gdbt():
    return render_template('gdbt.html')

@static_view_b.route('/xgboost')
def get_xgboost():
    return render_template('xgboost.html')


@static_view_b.route('/TimeLine')
def get_time_line():
    return render_template('timeline.html')


@static_view_b.route('/ContactList')
def get_contact_list():
    return render_template('contact-list.html')


@static_view_b.route('/company-risk-level', methods=['GET', 'POST'])
def get_company_risk_level():
    return 3


@static_view_b.route('/company-risk-type/<id>', methods=['GET', 'POST'])
def get_company_risk_type(id):
    id = json.loads(id)
    result = predict_all.predict(entid=id)
    result['type'] = str(result['type'])
    result['pro'] = result['pro'].tolist()
    print(result)
    return json.dumps(result)


@static_view_b.route('/company-risk-indicates', methods=['GET', 'POST'])
def get_company_risk_indicates():
    sample_data = {
        'x': 1,
        'y': 2
    }
    return json.dumps(sample_data)


@static_view_b.route('/description/<name>', methods=['GET', 'POST'])
def get_describ_data(name):
    json_data_path = "data/{}".format(name)
    with open(json_data_path, encoding="utf-8") as f:
        data = json.load(f)
    return json.dumps(data)

# mut args test
# @static_view_b.route('/<name1>/<name2>', methods=['GET', 'POST'])
# def mut_args_test(name1, name2):
#     dict = {
#         "name1": name1,
#         "name2": name2
#     }
#     return json.dumps(dict)


@static_view_b.route('data/company/<basic_com_info>', methods=['GET', 'POST'])
def get_company_basic_info(basic_com_info):
    json_data_path = "data/company/{}.json".format(basic_com_info)
    with open(json_data_path, encoding="utf-8") as f:
        data = json.load(f)
    return json.dumps(data)


@static_view_b.route('data/company/basic_com_info/<id>', methods=['GET', 'POST'])
def get_spe_company_basic_info(id):
    json_data_path = "data/company/basic_com_info.json"
    with open(json_data_path, encoding="utf-8") as f:
        data = json.load(f)
        for item in data:
            # print(type(item['entid']), type(id))
            # string string
            if item['entid'] == id:
                return json.dumps(item)
        print("cant find")
        return json.dumps("cant find")


@static_view_b.route('data/company/indicator/<id>', methods=['GET', 'POST'])
def get_company_indicator(id):
    json_data_path = "data/company/indicator.json"
    with open(json_data_path, encoding="utf-8") as f:
        data = json.load(f)
    return json.dumps(data[id])


@static_view_b.route('data/company/risk_type_show/<id>', methods=['GET', 'POST'])
def get_company_risk_type_show(id):
    json_data_path = "data/company/risk_type_show.json"
    with open(json_data_path, encoding="utf-8") as f:
        data = json.load(f)
    return json.dumps(data[id])

@static_view_b.route('data/feature/risk_level_show/<id>', methods=['GET', 'POST'])
def get_company_risk_level_show(id):
    json_data_path = "data/feature/level.json"
    with open(json_data_path, encoding="utf-8") as f:
        data = json.load(f)
    return json.dumps(data[id])


@static_view_b.route('data/feature/<name>', methods=['GET', 'POST'])
def get_feature_tsne(name):
    json_data_path = "data/feature/{}.json".format(name)
    with open(json_data_path, encoding="utf-8") as f:
        data = json.load(f)
    return json.dumps(data)


@static_view_b.route('model-risk-type/<model>/<id>', methods=['GET', 'POST'])
def get_company_type_by_model(model, id):
    id = json.loads(id)
    result = predict_all.predict(entid=id, model=model)
    result['type'] = str(result['type'])
    result['pro'] = result['pro'].tolist()
    print(result)
    return json.dumps(result)




@static_view_b.route('/news', methods=["POST", "GET"])
def get_news():
    origin_json_path = "data/news/2012-12-31.json"
    with open(origin_json_path, encoding="utf-8") as f:
        data = json.load(f)
    return json.dumps(data)


@static_view_b.route('/data/test/<name>', methods=["POST", "GET"])
def get_json_data(name):
    json_data_path = "data/test/{}.json".format(name)
    with open(json_data_path, encoding="utf-8") as f:
        data = json.load(f)
    return json.dumps(data)
