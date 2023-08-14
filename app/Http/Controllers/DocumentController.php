<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Dompdf\Dompdf;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'template_id' => 'required',
            'patient_id' => 'required',
            'data' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $document = new Document();
        $document->patient_id = $data['patient_id'];
        $document->template_id = $data['template_id'];
        $document->data = json_encode($data['data']);
        $document->save();
        if ($document) {
            $withtemplate = $document;
            $withtemplate->template = $document->template;
            return response()->json(['message' => 'Маягт нэмэгдлээ', 'document' => $document]);
        } else {
            return response()->json(['message' => 'Алдаа гарлаа', 'document' => null], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $document = Document::findOrFail($id);
        return response()->json(['message' => 'Маягт', 'document' => $document]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Document $document)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $data = $request->all();
        $validator = Validator::make($data, [
            'data' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $document = Document::findOrFail($id);
        $document->data = json_encode($data['data']);
        $document->save();
        if ($document) {
            $withtemplate = $document;
            $withtemplate->template = $document->template;
            return response()->json(['message' => 'Маягт хадгалагдлаа', 'document' => $document]);
        } else {
            return response()->json(['message' => 'Алдаа гарлаа', 'document' => null], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $document = Document::find($id);

        if ($document) {
            $document->delete();
            return response()->json(['message' => 'Маягт устгагдлаа'], 200);
        } else {
            return response()->json(['message' => 'Маягт байхгүй байна'], 404);
        }
    }

    public function getByPatient($id)
    {
        $documents = Document::where('patient_id', $id)
            ->with('template:id,name')
            ->whereHas('template', function ($query) {
                $query->whereNotNull('id');
            })
            ->orderBy('created_at', 'desc')->get();
        return response()->json(['message' => 'Амжилттай', 'document' => $documents], 200);
    }

    public function getPDF(Request $request)
    {
        $data = $request->all();
        $html = '<html><head><meta charset="utf-8"></head><body style="font-family: Arial, sans-serif;">';
        $dompdf = new Dompdf([
            'defaultFont' => 'DejaVu Sans'
        ]);
        foreach ($data['html'] as $key => $value) {
            $html = $html . $value;
        }
        $html = $html . '</body></html>';
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        $pdfContent = $dompdf->output();
        $base64EncodedPDF = base64_encode($pdfContent);
        return response()->json(['message' => 'Амжилттай', 'data' => $base64EncodedPDF], 200);
    }

    public function getIds(Request $request)
    {
        $data = $request->all();
        $documents = Document::whereIn('id', $data['ids'])->get();
        foreach ($documents as $key => $value) {
            $documents[$key]->template = Template::findOrFail($value->template_id);
        }
        return response()->json(['message' => 'Амжилттай', 'document' => $documents], 200);
    }
}
