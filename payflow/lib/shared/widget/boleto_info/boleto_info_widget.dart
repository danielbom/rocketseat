import 'package:flutter/material.dart';
import 'package:payflow/shared/themes/app_colors.dart';
import 'package:payflow/shared/themes/app_images.dart';
import 'package:payflow/shared/themes/app_text_styles.dart';

class BoletoInfoWidget extends StatelessWidget {
  final int boletosCount;

  const BoletoInfoWidget({ Key? key, required this.boletosCount }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final barcodeImage = Image.asset(
      AppImages.logomini,
      color: AppColors.background,
      width: 56,
      height: 34
    );
    final middleLine = Container(
      width: 1,
      height: 32,
      color: AppColors.background
    );
    final description = Text.rich(
      TextSpan(
        text: "Você tem ",
        style: TextStyles.captionBackground,
        children: [
          TextSpan(
            text: "${this.boletosCount}\n",
            style: TextStyles.captionBoldBackground
          ),
          TextSpan(
            text: "cadastrados para pagar",
            style: TextStyles.captionBackground
          ),
        ]
      )
    );
    
    return Container(
      decoration: BoxDecoration(
        color: AppColors.secondary,
        borderRadius: BorderRadius.circular(5)
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 24),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            barcodeImage,
            middleLine,
            description
          ]
        ),
      )
    );
  }
}
