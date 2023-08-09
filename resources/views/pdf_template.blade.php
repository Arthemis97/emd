<!DOCTYPE html>
<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<style>
		@page {
			size: A4;
			margin: 0;
		}

		@media print {
			* {
				line-height: 5mm !important;
			}

			.pageBreak {
				display: none !important;
				page-break-after: always !important;
				height: 0 !important;
				clear: both !important;
			}

			table {
				width: 100% !important;
			}
		}
	</style>
</head>

<body>
	{!! $content !!}
</body>

</html>