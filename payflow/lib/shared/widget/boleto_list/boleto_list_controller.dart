
import 'package:flutter/foundation.dart';
import 'package:payflow/shared/models/boleto_model.dart';
import 'package:shared_preferences/shared_preferences.dart';

class BoletoListController {
  final boletos$ = ValueNotifier<List<BoletoModel>>([]);

  List<BoletoModel> get boletos => this.boletos$.value;
  set boletos(List<BoletoModel> value) => this.boletos$.value = value;

  Future<void> getBoletos() async {
    try {
      final instance = await SharedPreferences.getInstance();
      final response = instance.getStringList("boletos") ?? [];
      this.boletos = response.map((source) => BoletoModel.fromJson(source)).toList();
    } catch (e) {
      this.boletos = [];
    }
  }
}
