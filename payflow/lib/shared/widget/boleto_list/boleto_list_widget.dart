import 'package:flutter/material.dart';

import 'package:payflow/shared/widget/boleto_list/boleto_list_controller.dart';
import 'package:payflow/shared/widget/boleto_tile/boleto_tile_widget.dart';

class BoletoListWidget extends StatefulWidget {
  final BoletoListController controller;

  const BoletoListWidget({
    Key? key,
    required this.controller,
  }) : super(key: key);

  @override
  _BoletoListWidgetState createState() => _BoletoListWidgetState();
}

class _BoletoListWidgetState extends State<BoletoListWidget> {

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<List>(
      valueListenable: this.widget.controller.boletos$,
      builder: (_ctx, boletos, _widget) => Column(
        children: boletos
          .map((model) => BoletoTileWidget(model: model))
          .toList()
      ),
    );
  }
}
