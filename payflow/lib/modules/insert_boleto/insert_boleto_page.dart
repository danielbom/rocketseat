import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:flutter_masked_text2/flutter_masked_text2.dart';
import 'package:payflow/modules/insert_boleto/insert_boleto_controller.dart';
import 'package:payflow/shared/themes/app_colors.dart';
import 'package:payflow/shared/themes/app_text_styles.dart';
import 'package:payflow/shared/widget/input_text/input_text_widget.dart';
import 'package:payflow/shared/widget/set_label_buttons/set_label_button.dart';

class InsertBoletoPage extends StatefulWidget {
  final String? barcode;

  const InsertBoletoPage({ Key? key, this.barcode }) : super(key: key);

  @override
  _InsertBoletoPageState createState() => _InsertBoletoPageState();
}

class _InsertBoletoPageState extends State<InsertBoletoPage> {
  final controller = InsertBoletoController();

  final moneyInputTextController = MoneyMaskedTextController(
    leftSymbol: "R\$", 
    decimalSeparator: ","
  );
  final dueDateInputTextController = MaskedTextController(mask: "00/00/0000");
  final barcodeInputTextController = TextEditingController();

  @override
  void initState() {
    if (this.widget.barcode != null) {
      barcodeInputTextController.text = this.widget.barcode!;
    }
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final form = Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 93),
          child: Text(
            "Preecha os dados do boleto",
            style: TextStyles.titleBoldHeading,
            textAlign: TextAlign.center,
          ),
        ),
        SizedBox(height: 24),
        Form(
          key: controller.formKey,
          child: Column(
            children: [
              InputTextWidget(
                controller: null,
                onChanged: (value) {
                  this.controller.onChanged(name: value);
                },
                validator: this.controller.validateName,
                label: "Nome do boleto",
                icon: Icons.description_outlined
              ),
              InputTextWidget(
                controller: dueDateInputTextController,
                onChanged: (value) {
                  this.controller.onChanged(dueDate: value);
                },
                validator: this.controller.validateDueDate,
                label: "Vencimento",
                icon: FontAwesomeIcons.timesCircle
              ),
              InputTextWidget(
                controller: moneyInputTextController,
                onChanged: (value) {
                  this.controller.onChanged(value: this.moneyInputTextController.numberValue);
                },
                validator: (_value) => 
                  this.controller.validateValue(this.moneyInputTextController.numberValue),
                label: "Valor",
                icon: FontAwesomeIcons.wallet
              ),
              InputTextWidget(
                controller: barcodeInputTextController,
                onChanged: (value) {
                  this.controller.onChanged(barcode: value);
                },
                validator: this.controller.validateBarcode,
                label: "Código",
                icon: FontAwesomeIcons.barcode
              ),
            ]
          ),
        )
      ]
    );

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: BackButton(color: AppColors.input),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: form,
        ),
      ),
      bottomNavigationBar: SetLabelButtons(
        highlightSecond: true,
        firstLabel: "Cancelar",
        firstOnPress: () {
          Navigator.pop(context);
        },
        secondLabel: "Cadastrar",
        secondsOnPress: () async {
          await this.controller.registerBoleto();
          Navigator.pop(context);
        },
      ),
    );
  }
}
