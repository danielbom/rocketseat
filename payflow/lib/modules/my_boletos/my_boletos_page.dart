import 'package:animated_card/animated_card.dart';
import 'package:flutter/material.dart';
import 'package:payflow/shared/themes/app_colors.dart';
import 'package:payflow/shared/themes/app_text_styles.dart';
import 'package:payflow/shared/widget/boleto_info/boleto_info_widget.dart';
import 'package:payflow/shared/widget/boleto_list/boleto_list_controller.dart';
import 'package:payflow/shared/widget/boleto_list/boleto_list_widget.dart';

class MyBoletosPage extends StatefulWidget {  
  const MyBoletosPage({ Key? key }) : super(key: key);

  @override
  _MyBoletosPageState createState() => _MyBoletosPageState();
}

class _MyBoletosPageState extends State<MyBoletosPage> {
  @override
  Widget build(BuildContext context) {
    final controller = BoletoListController();
    controller.getBoletos();

    return SingleChildScrollView(
      child: Stack(
        children: [
          // Extended AppBar
          Container(
            color: AppColors.primary,
            height: 40,
            width: double.maxFinite
          ),
    
          // Content
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              children: [
                ValueListenableBuilder<List>(
                  valueListenable: controller.boletos$,
                  builder: (ctx, boletos, widget) => 
                    AnimatedCard(
                      direction: AnimatedCardDirection.top,
                      child: BoletoInfoWidget(boletosCount: boletos.length)
                    )
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 24),
                  child: Text(
                    "Meus boletos",
                    style: TextStyles.titleBoldHeading
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 24),
                  child: Divider(
                    thickness: 1,
                    height: 1,
                    color: AppColors.stroke
                  ),
                ),
                BoletoListWidget(
                  controller: controller,
                )
              ]
            )
          )
        ]
      ),
    );
  }
}
