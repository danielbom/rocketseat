import 'package:flutter/cupertino.dart';
import 'package:payflow/shared/models/boleto_model.dart';
import 'package:shared_preferences/shared_preferences.dart';

typedef String? Validator<T>(T? value);

class InsertBoletoController {
  final formKey = GlobalKey<FormState>();
  var model = BoletoModel();

  Validator<String> validateName = (value) => 
    value?.isEmpty ?? true ? "O nome não pode ser vazio" : null;

  Validator<String> validateDueDate = (value) => 
    value?.isEmpty ?? true ? "A data de vencimento não pode ser vazio" : null;

  Validator<double> validateValue = (value) => 
    value == 0 ? "Insira um valor maior que R\$ 0,00" : null;

  Validator<String> validateBarcode = (value) => 
    value?.isEmpty ?? true ? "O código do boleto não pode ser vazio" : null;

  Future<void> saveBoleto() async {
    final instance = await SharedPreferences.getInstance();
    final boletos = instance.getStringList("boletos") ?? [];
    boletos.add(this.model.toJson());
    await instance.setStringList("boletos", boletos);
  }

  Future<void> registerBoleto() async {
    final form = formKey.currentState;
    if (form!.validate()) {
      await this.saveBoleto();
    }
  }

  onChanged({String? barcode, double? value, String? dueDate, String? name}) {
    this.model = this.model.copyWith(
      name: name,
      dueDate: dueDate,
      value: value,
      barcode: barcode,
    );
  }
}
