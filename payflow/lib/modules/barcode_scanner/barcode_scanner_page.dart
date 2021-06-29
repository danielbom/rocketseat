import 'package:flutter/material.dart';
import 'package:payflow/modules/barcode_scanner/barcode_scanner_controller.dart';
import 'package:payflow/modules/barcode_scanner/barcode_scanner_status.dart';
import 'package:payflow/shared/themes/app_colors.dart';
import 'package:payflow/shared/themes/app_text_styles.dart';
import 'package:payflow/shared/widget/bottom_sheet/bottom_sheet_widget.dart';
import 'package:payflow/shared/widget/set_label_buttons/set_label_button.dart';

class BarcodeScannerPage extends StatefulWidget {
  const BarcodeScannerPage({ Key? key }) : super(key: key);

  @override
  _BarcodeScannerPageState createState() => _BarcodeScannerPageState();
}

class _BarcodeScannerPageState extends State<BarcodeScannerPage> {
  final controller = BarcodeScannerController();

  @override
  void initState() {
    this.controller.getAvailableCameras();
    this.controller.status$.addListener(() {
      if (this.controller.status.hasBarcode) {
        Navigator.pushReplacementNamed(
          this.context,
          "/insert_boleto",
          arguments: this.controller.status.barcode
        );
      }
    });
    super.initState();
  }

  @override
  void dispose() {
    this.controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final appBar = AppBar(
      backgroundColor: Colors.black,
      centerTitle: true,
      title: Text(
        "Escaneie o código de barras do boleto",
        style: TextStyles.buttonBackground,
      ),
      leading: BackButton(color: AppColors.background),
    );
    
    final blackShade = Colors.black.withOpacity(0.6);
    final barCodeMask = Column(
      children: [
        Expanded(child:  Container(color: blackShade)),
        Expanded(
          flex: 2,
          child:  Container(color: Colors.transparent)
        ),
        Expanded(child: Container(color: blackShade))
      ]
    );
    final buttons = SetLabelButtons(
      firstLabel: "Inserir código do boleto",
      firstOnPress: () {
        Navigator.pushReplacementNamed(this.context, "/insert_boleto");
      },
      secondLabel: "Adicionar da galeria",
      secondsOnPress: () {
        this.controller.scanWithImagePicker();
      },
    );

    var barCodePreview = ValueListenableBuilder<BarcodeScannerStatus>(
      valueListenable: this.controller.status$,
      builder: (ctx, status, widget) {
        if (status.showCamera && this.controller.cameraController != null) {
          return Container(
            child: this.controller.cameraController!.buildPreview()
          );
        } else {
          return Container();
        }
      }
    );
    var barCodeContainer = RotatedBox(
      quarterTurns: 1,
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: appBar,
        body: barCodeMask,
        bottomNavigationBar: buttons,
      ),
    );
    var barCodeErrorMessage = ValueListenableBuilder<BarcodeScannerStatus>(
      valueListenable: this.controller.status$,
      builder: (ctx, status, widget) {
        if (status.hasError) {
          return BottomSheetWidget(
            title: "Não foi possível identificar um código de barras.",
            subtitle: "Tente escanear novamente ou digite o código do seu boleto.",
            firstLabel: "Escanear novamente",
            firstOnPress: () {
              this.controller.scanWithCamera();
            },
            secondLabel: "Digitar código",
            secondsOnPress: () {
              Navigator.pushReplacementNamed(this.context, "/insert_boleto");
            },
          );
        } else {
          return Container();
        }
      }
    );

    return SafeArea(
      child: Stack(
        children: [
          barCodePreview,
          barCodeContainer,
          barCodeErrorMessage,
        ],
      ),
    );
  }
}
